import { describe, expect, it } from 'vitest';
import { linkEntities } from '../api/_lib/entityLinker';
import { getKb } from '../api/_lib/kb';

const kb = getKb();
const ids = (q: string) => linkEntities(q, kb).map(e => e.recordId);
const strongIds = (q: string) => linkEntities(q, kb).filter(e => e.strong).map(e => e.recordId);

describe('linkEntities', () => {
  it('links a companion and an event named in one question', () => {
    const linked = strongIds('ماذا فعل علي بن أبي طالب في غزوة بدر؟');
    expect(linked).toContain('companion:ali');
    expect(linked).toContain('event:battle-badr');
  });

  it('does not read the preposition على as the name علي', () => {
    expect(ids('ما الذي حدث على جبل أحد')).not.toContain('companion:ali');
    expect(ids('ماذا فعل علي في أحد')).toContain('companion:ali');
  });

  it('matches through attached prepositions and case forms', () => {
    expect(ids('كم عدد المسلمين ببدر')).toContain('event:battle-badr');
    expect(ids('ما علاقة عمر بأبي بكر')).toContain('companion:abu-bakr');
    expect(ids('لماذا سمي عمر بالفاروق')).toContain('companion:umar');
  });

  it('finds an event by its parenthetical or short name', () => {
    expect(ids('حدثني عن الأحزاب')).toContain('event:battle-khandaq');
    expect(ids('متى كان صلح الحديبية')).toContain('event:treaty-hudaybiyyah');
  });

  it('prefers the longest phrase (era over the caliph alone)', () => {
    const linked = ids('ما هي معارك عهد عمر بن الخطاب');
    expect(linked).toContain('list:era:umar');
    expect(linked).not.toContain('companion:umar');
  });

  it('does not link a different person who shares a first name', () => {
    expect(ids('من هو مالك بن نويرة')).not.toContain('companion:malik-ibn-awf');
    expect(ids('من هو عمر بن عبد العزيز')).not.toContain('companion:umar');
  });

  it('never lets a shortened event title stand in for a person ("سرية حمزة بن عبد المطلب")', () => {
    const linked = ids('من قتل حمزة بن عبد المطلب؟');
    expect(linked).toContain('companion:hamza');
    expect(linked).not.toContain('event:sariyyat-hamza');
  });

  it('keeps generic references to the Prophet weak', () => {
    const prophet = linkEntities('من كان صاحب النبي في الغار', kb).find(e => e.recordId === 'companion:prophet-muhammad');
    expect(prophet?.strong).toBe(false);
  });

  it('links nothing in an unrelated question', () => {
    expect(ids('ما عاصمة فرنسا')).toEqual([]);
  });
});
