/**
 * The visitor question set, offline: the real handler pipeline (search,
 * context, prompt, validator, composer) with the copy model and the stored
 * query vectors. A case marked knownGap must still fail: when a fix makes it
 * pass, remove the mark.
 */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { answerQuestion } from '../api/chat';
import { newTrace } from '../api/_lib/trace';
import { checkTurn, fixtureEmbedder, loadVisitors, runFlow, type AnswerFn } from '../scripts/chat-eval/visitors';
import { installCopyModel } from '../scripts/chat-eval/copyModel';

const { questions, flows } = loadVisitors();
const embed = fixtureEmbedder();

const answer: AnswerFn = async (q, context) => {
  const trace = newTrace(q);
  const { status, body } = await answerQuestion(q, { noCache: true, trace, embed, context });
  return { status, body, trace };
};

let uninstall = () => {};
beforeAll(() => {
  uninstall = installCopyModel();
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterAll(() => {
  uninstall();
  vi.restoreAllMocks();
});

const expectOutcome = (problems: string[], knownGap: string | undefined) => {
  if (knownGap) expect(problems, `known gap now passes, remove the mark: ${knownGap}`).not.toEqual([]);
  else expect(problems).toEqual([]);
};

describe('visitor questions', () => {
  it('ids are unique', () => {
    expect(new Set(questions.map(q => q.id)).size).toBe(questions.length);
    expect(new Set(flows.map(f => f.id)).size).toBe(flows.length);
  });

  for (const question of questions) {
    it(`${question.id}: ${question.q}`, async () => {
      const { status, body, trace } = await answer(question.q, undefined);
      expectOutcome(checkTurn(question, status, body, trace, false), question.knownGap);
    });
  }
});

describe('visitor flows', () => {
  for (const flow of flows) {
    it(flow.id, async () => {
      const results = await runFlow(flow, answer, false);
      expect(results).toHaveLength(flow.turns.length);
      results.forEach((result, i) => {
        const turn = flow.turns[i];
        const problems = result.problems.map(p => `turn ${i + 1} «${result.q}»: ${p}`);
        expectOutcome(problems, turn.knownGap);
      });
    });
  }
});
