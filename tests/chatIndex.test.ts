import { describe, expect, it } from 'vitest';
import committedKb from '../api/_data/chat-kb.json';
import type { ChatKb } from '../shared/chatKb';
import { embeddingText, isEmbeddable, textHash } from '../api/_lib/embeddings';
import { buildProviderIndex, decodeVector, encodeVector, type EmbeddingIndexFile } from '../api/_lib/semanticIndex';
import { checkIndexSync } from '../scripts/check-chat-index';
import type { LoadedKb } from '../api/_lib/kb';

const DIMS = 768;

// A small KB cut from the real one: its first 30 units (some embeddable, some not) and their records.
const fullKb = committedKb as unknown as ChatKb;
const units = fullKb.units.slice(0, 30);
const kb: ChatKb = { ...fullKb, units, records: fullKb.records.filter(r => units.some(u => u.recordId === r.id)) };
const recordById = new Map(kb.records.map(r => [r.id, r]));

/** A deterministic pseudo-random vector per seed. */
function vector(seed: number): number[] {
  let x = seed * 2654435761;
  return Array.from({ length: DIMS }, () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648 - 0.5;
  });
}

function indexFor(source: ChatKb): EmbeddingIndexFile {
  const embeddable = source.units.filter(isEmbeddable);
  return {
    provider: 'gemini',
    model: 'gemini-embedding-001',
    dims: DIMS,
    format: 'int8',
    ids: embeddable.map(u => u.id),
    hashes: embeddable.map(u => textHash(embeddingText(u, recordById.get(u.recordId), 'gemini'))),
    vectors: embeddable.map((_, i) => encodeVector(vector(i + 1), 'int8')),
  };
}

const cosine = (a: ArrayLike<number>, b: ArrayLike<number>) => {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / Math.sqrt(na * nb);
};

describe('int8 vectors', () => {
  it('decode to unit length, close to the float vector', () => {
    const v = vector(7);
    const decoded = decodeVector(encodeVector(v, 'int8'), 'int8');
    expect(decoded).toHaveLength(DIMS);
    expect(cosine(decoded, decoded)).toBeCloseTo(1, 6);
    expect(cosine(decoded, v)).toBeGreaterThan(0.999);
  });

  it('keep float32 files readable', () => {
    const v = vector(3);
    expect(cosine(decodeVector(encodeVector(v, 'float32')), v)).toBeCloseTo(1, 6);
  });

  it('rank neighbours as float32 does', () => {
    const query = vector(1).map((x, i) => x + 0.3 * vector(2)[i]);
    const candidates = Array.from({ length: 20 }, (_, i) => vector(i + 1));
    const order = (vecs: ArrayLike<number>[]) =>
      vecs
        .map((v, i) => [cosine(query, v), i] as const)
        .sort((a, b) => b[0] - a[0])
        .slice(0, 3)
        .map(x => x[1]);
    expect(order(candidates.map(v => decodeVector(encodeVector(v, 'int8'), 'int8')))).toEqual(order(candidates));
  });

  it('build a usable provider index at full coverage', () => {
    const file = indexFor(kb);
    const loaded = { units: kb.units, recordById } as unknown as LoadedKb;
    const index = buildProviderIndex(loaded, file, 'gemini');
    expect(index.coverage).toBe(1);
    expect(index.usable).toBe(true);
    expect(index.vectors).toHaveLength(file.ids.length);
  });
});

describe('check:chat-index', () => {
  it('passes when every embeddable unit has its current vector', () => {
    expect(kb.units.filter(isEmbeddable).length).toBeGreaterThan(3);
    expect(checkIndexSync(kb, indexFor(kb))).toEqual({ missing: [], extra: [], fileProblems: [] });
  });

  it('lists a unit with no vector', () => {
    const file = indexFor(kb);
    const [droppedId] = file.ids.splice(0, 1);
    file.hashes.splice(0, 1);
    file.vectors.splice(0, 1);
    const report = checkIndexSync(kb, file);
    expect(report.missing.map(m => m.id)).toEqual([droppedId]);
    expect(report.extra).toEqual([]);
  });

  it('treats a vector made from older text as missing and stale', () => {
    const file = indexFor(kb);
    file.hashes[1] = '000000000000';
    const report = checkIndexSync(kb, file);
    expect(report.missing.map(m => m.id)).toEqual([file.ids[1]]);
    expect(report.extra).toEqual([file.ids[1]]);
  });

  it('flags vectors for units that are gone', () => {
    const file = indexFor(kb);
    file.ids.push('event:gone#summary');
    file.hashes.push('000000000000');
    file.vectors.push(encodeVector(vector(99), 'int8'));
    expect(checkIndexSync(kb, file).extra).toEqual(['event:gone#summary']);
  });

  it('flags a file of the wrong model, size or format', () => {
    const file = { ...indexFor(kb), model: 'other', dims: 1024, format: undefined };
    const problems = checkIndexSync(kb, file).fileProblems.join(' | ');
    expect(problems).toMatch(/model is other/);
    expect(problems).toMatch(/dims is 1024/);
    expect(problems).toMatch(/format is float32/);
  });
});
