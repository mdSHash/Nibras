/**
 * A scripted stand-in for the answer model, for offline runs (Vitest and
 * `npm run eval:chat -- --visitors --offline`): it answers every prompt with
 * one section holding the first record's first passages, as a plain model
 * would. No network, no quota.
 */

const PASSAGE = /^(s\d+)( \[[^\]]*\])?: (.*)$/;

export function copyModelAnswer(system: string, maxPassages = 6): string {
  const firstBlock = (system.split('المقاطع:\n')[1] ?? '').split('\n\n')[0];
  const points = firstBlock
    .split('\n')
    .map(line => PASSAGE.exec(line))
    .filter((m): m is RegExpExecArray => m !== null)
    .slice(0, maxPassages)
    .map(([, ref]) => ref);
  return JSON.stringify({ answerable: true, sections: [{ shape: 'paragraph', heading: '', refs: points }] });
}

/** Replaces fetch: chat completions get the copy model, anything else fails. Returns the undo. */
export function installCopyModel(): () => void {
  const saved = { fetch: globalThis.fetch, key: process.env.GROQ_API_KEY, chain: process.env.LLM_PROVIDER_CHAIN };
  process.env.GROQ_API_KEY = 'offline';
  process.env.LLM_PROVIDER_CHAIN = 'groq:copy-model';
  globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
    if (!String(url).includes('/chat/completions')) return new Response('no network offline', { status: 500 });
    const body = JSON.parse(String(init?.body)) as { messages: { role: string; content: string }[] };
    const system = body.messages.find(m => m.role === 'system')?.content ?? '';
    return Response.json({ choices: [{ message: { content: copyModelAnswer(system) } }], usage: { prompt_tokens: 0, completion_tokens: 0 } });
  }) as typeof fetch;
  return () => {
    globalThis.fetch = saved.fetch;
    if (saved.key === undefined) delete process.env.GROQ_API_KEY;
    else process.env.GROQ_API_KEY = saved.key;
    if (saved.chain === undefined) delete process.env.LLM_PROVIDER_CHAIN;
    else process.env.LLM_PROVIDER_CHAIN = saved.chain;
  };
}
