// Offline stand-ins for everything the app fetches from other hosts, so test
// runs are deterministic and never touch the network.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
import type { Page, Route } from '@playwright/test';
import { FAKE_YOUTUBE_API } from './fakeYouTube';

export const CHAT_API_URL = 'http://chat.test/api/chat';
export const FEEDBACK_API_URL = 'http://chat.test/api/feedback';

// ---- A plain map tile -------------------------------------------------------
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type: string, data: Buffer): Buffer {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}
/** A solid-color 256×256 PNG (a sandy tone close to the satellite imagery). */
function solidPng(r: number, g: number, b: number): Buffer {
  const size = 256;
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // RGB
  const row = Buffer.alloc(1 + size * 3);
  for (let x = 0; x < size; x++) row.set([r, g, b], 1 + x * 3);
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}
const TILE = solidPng(196, 178, 140);

// ---- Silent narration audio ---------------------------------------------------
/** A silent mono 16-bit WAV of the given length. */
function silentWav(seconds: number, sampleRate = 8000): Buffer {
  const dataSize = Math.round(seconds * sampleRate) * 2;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVEfmt ', 8, 'ascii');
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36, 'ascii');
  header.writeUInt32LE(dataSize, 40);
  return Buffer.concat([header, Buffer.alloc(dataSize)]);
}
export const SILENT_WAV = silentWav(3);

// ---- Routes -------------------------------------------------------------------------
export interface NetworkLog {
  audioRequests: string[];
  chatRequests: unknown[];
  /** Loads of the (fake) YouTube IFrame API: only the battle video player asks for it. */
  youtubeRequests: string[];
  unexpected: string[];
}

export type ChatResponder = (body: { message: string }) => { status?: number; json: unknown };

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type',
  'access-control-allow-methods': 'POST, OPTIONS',
};

export async function installStubs(page: Page, log: NetworkLog, chat: () => ChatResponder): Promise<void> {
  await page.route('**/*', async (route: Route) => {
    const request = route.request();
    const url = new URL(request.url());
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

    if (isLocal && url.pathname.endsWith('.wav')) {
      log.audioRequests.push(url.pathname.split('/').pop() ?? '');
      // Only answer for files that exist in the build, like the real server.
      const exists = existsSync(join(import.meta.dirname, '..', '..', '..', 'dist', 'audio', url.pathname.split('/').pop() ?? ''));
      return exists
        ? route.fulfill({ status: 200, contentType: 'audio/wav', body: SILENT_WAV })
        : route.fulfill({ status: 404, body: '' });
    }
    if (isLocal) return route.continue();

    // The battle video player's YouTube IFrame API (3H): a stand-in, never the real one.
    if (url.href === 'https://www.youtube.com/iframe_api') {
      log.youtubeRequests.push(url.href);
      return route.fulfill({ status: 200, contentType: 'text/javascript', body: FAKE_YOUTUBE_API });
    }
    if (url.hostname === 'server.arcgisonline.com') {
      return route.fulfill({ status: 200, contentType: 'image/png', body: TILE });
    }
    if (url.origin === new URL(CHAT_API_URL).origin) {
      if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
      if (request.url() === FEEDBACK_API_URL) return route.fulfill({ status: 200, headers: CORS, json: { ok: true } });
      const body = request.postDataJSON() as { message: string };
      log.chatRequests.push(body);
      const reply = chat()(body);
      return route.fulfill({ status: reply.status ?? 200, headers: CORS, json: reply.json });
    }
    log.unexpected.push(request.url());
    return route.fulfill({ status: 204, body: '' });
  });
}
