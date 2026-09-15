/**
 * Caches finished answers to repeated questions, so a popular question costs
 * one model call instead of one per visitor. Keys include the knowledge-base
 * hash (a redeploy with new data never serves an old answer) and any records
 * carried from conversation context. Per-instance memory always; the shared
 * store as well when configured.
 */
import crypto from 'crypto';
import type { ChatSuccessBody } from '../../shared/chatApi.js';
import { normalizeForMatch } from '../../shared/arabicText.js';
import { storeGet, storeSet } from './store.js';

const MEMORY_LIMIT = 300;
const TTL_SECONDS = 12 * 60 * 60;
const memory = new Map<string, { expires: number; body: ChatSuccessBody }>();

export function answerCacheKey(kbHash: string, question: string, carriedRecordIds: string[]): string {
  const material = `${normalizeForMatch(question)}|${[...carriedRecordIds].sort().join(',')}`;
  return `nibras:chat:${kbHash.slice(0, 12)}:${crypto.createHash('sha1').update(material).digest('hex')}`;
}

export async function getCachedAnswer(key: string): Promise<ChatSuccessBody | null> {
  const local = memory.get(key);
  if (local && local.expires > Date.now()) return local.body;
  if (local) memory.delete(key);
  const shared = await storeGet(key);
  if (!shared) return null;
  try {
    const body = JSON.parse(shared) as ChatSuccessBody;
    remember(key, body);
    return body;
  } catch {
    return null;
  }
}

function remember(key: string, body: ChatSuccessBody) {
  if (memory.size >= MEMORY_LIMIT) memory.delete(memory.keys().next().value as string);
  memory.set(key, { expires: Date.now() + TTL_SECONDS * 1000, body });
}

export async function cacheAnswer(key: string, body: ChatSuccessBody): Promise<void> {
  remember(key, body);
  await storeSet(key, JSON.stringify(body), TTL_SECONDS);
}

/** For tests. */
export function clearAnswerCache() {
  memory.clear();
}
