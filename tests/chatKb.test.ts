import { beforeAll, describe, expect, it } from 'vitest';
import committedKb from '../api/_data/chat-kb.json';
import quranPassages from '../src/generated/quranPassages.json';
import { fullEvents as eventsData } from '../scripts/content/generated';
import type { ChatKb } from '../shared/chatKb';
import { buildChatKb } from '../scripts/build-chat-kb';
import { BuildContext, mentionsQuantity } from '../scripts/chat-kb/common';

let kb: ChatKb;
let ctx: BuildContext;

beforeAll(() => {
  ({ kb, ctx } = buildChatKb());
}, 60000);

describe('knowledge base build', () => {
  it('matches the committed api/_data/chat-kb.json (run npm run build:chat-kb after data changes)', () => {
    expect((committedKb as unknown as ChatKb).contentHash).toBe(kb.contentHash);
  });

  it('has unique unit ids that all point at existing records', () => {
    const records = new Set(kb.records.map(r => r.id));
    const ids = new Set<string>();
    for (const unit of kb.units) {
      expect(ids.has(unit.id), unit.id).toBe(false);
      ids.add(unit.id);
      expect(records.has(unit.recordId), unit.id).toBe(true);
    }
  });

  it('reports no errors now that the Badr scenario quote is corrected', () => {
    expect(ctx.issues.filter(i => i.severity === 'error')).toEqual([]);
    expect(kb.units.some(u => u.text.includes('يَوْمُ الْفُرْقانِ يَوْمَ') || u.text.includes('يَوْمُ الفُرْقَانِ يَوْمَ'))).toBe(false);
  });

  it('classifies military events by the غزوة / سرية / معركة rule', () => {
    const kind = (id: string) => kb.records.find(r => r.id === id)?.military;
    expect(kind('event:battle-badr')).toBe('ghazwa');
    expect(kind('event:conquest-mecca')).toBe('ghazwa');
    expect(kind('event:battle-mutah')).toBe('sariyya');
    expect(kind('event:sariyyat-hamza')).toBe('sariyya');
    expect(kind('event:fijar-war')).toBe('harb');
    expect(kind('event:conquest-damascus')).toBe('maaraka');
    expect(kind('event:battle-yarmouk')).toBe('maaraka');
    expect(kind('event:boycott-hashim')).toBeUndefined();
  });

  it('never calls a post-Prophet event or list a غزوة', () => {
    for (const record of kb.records.filter(r => r.type === 'event' && r.military && r.military !== 'ghazwa')) {
      expect(record.title.replace(/[ً-ٰٟ]/g, ''), record.id).not.toMatch(/^غزوة/);
    }
    for (const unit of kb.units.filter(u => u.kind === 'list' && /abuBakr|umar|uthman|ali/.test(u.recordId))) {
      expect(unit.list!.heading, unit.id).not.toMatch(/غزو/);
      for (const item of unit.list!.items) expect(item, unit.id).not.toMatch(/^غزوة/);
    }
  });

  it('lists conquests titled "فتح" among the battles of the era of Umar', () => {
    const battles = kb.units.find(u => u.id === 'list:era:umar#battles')!.list!.items;
    expect(battles).toContain('فتح دمشق');
    expect(battles).toContain('معركة اليرموك');
    const others = kb.units.find(u => u.id === 'list:era:umar#events')!.list!.items;
    expect(others.some(t => t.startsWith('فتح') || t.startsWith('معركة'))).toBe(false);
  });
});

describe('verbatim guarantees', () => {
  it('stores every verse exactly as src/generated/quranPassages.json has it', () => {
    const verses = kb.units.filter(u => u.kind === 'quran_verse');
    expect(verses).toHaveLength(quranPassages.length);
    for (const unit of verses) {
      expect(unit.text).toBe(quranPassages.find(p => p.key === unit.refs.quranKey)!.text);
      expect(unit.verbatimOnly).toBe(true);
    }
  });

  it('contains only Qur\'an quotes that verify against Tanzil', () => {
    for (const unit of kb.units) {
      if (unit.kind === 'quran_verse') continue;
      for (const match of unit.text.matchAll(/﴿([^﴾]*)﴾/g)) {
        expect(ctx.verifyQuote(match[1]).ok, `${unit.id}: ${match[1]}`).toBe(true);
      }
    }
  });

  it('copies each companion role from the event record verbatim', () => {
    const byId = new Map(kb.units.map(u => [u.id, u]));
    for (const event of eventsData) {
      event.roles.forEach((role, i) => {
        expect(byId.get(`event:${event.id}#role:${i}`)?.text).toContain(role.roleAr.replace(/\s+/g, ' ').trim());
      });
    }
  });

  it('never puts a vowelled title inside a template label', () => {
    for (const unit of kb.units.filter(u => ['event_date', 'event_location', 'event_army', 'event_duration', 'event_role', 'event_quran', 'event_hadith'].includes(u.kind))) {
      const label = unit.text.split(':')[0];
      expect(label, unit.id).not.toMatch(/[ً-ْ]/);
    }
  });

  it('keeps quantities from battle scenarios out when an event record covers the battle', () => {
    // A battle video's captions keep their figures (Mostafa, 2026-10-17: facts only the video states
    // stay in its captions); the replays' text does not.
    const battleUnits = kb.units.filter(u => u.trust === 'secondary' && !u.list && u.kind !== 'battle_video');
    expect(battleUnits.length).toBeGreaterThan(100);
    for (const unit of battleUnits) expect(mentionsQuantity(unit.text), unit.id).toBe(false);
  });

  it("tells Badr by its video's captions, each line with its Arabic references, instead of the replay", () => {
    const badr = kb.units.filter(u => u.recordId === 'battle:badr');
    expect(new Set(badr.map(u => u.kind))).toEqual(new Set(['battle_video']));
    expect(badr).toHaveLength(42);
    expect(badr.filter(u => u.sources?.length).length).toBeGreaterThan(30);
    for (const unit of badr) for (const source of unit.sources ?? []) expect(source, unit.id).not.toMatch(/[A-Za-z]/);
    // Recitation-only lines are cited, never restated.
    expect(badr.filter(u => u.verbatimOnly).map(u => u.id)).toEqual(['battle:badr#video:22', 'battle:badr#video:31', 'battle:badr#video:41']);
    // Other battles keep their replay text.
    expect(kb.units.some(u => u.recordId === 'battle:uhud' && u.kind === 'battle_narration')).toBe(true);
  });

  it('contains no Latin-script words', () => {
    for (const unit of kb.units) expect(unit.text, unit.id).not.toMatch(/[A-Za-z]{3,}/);
  });
});

describe('lists', () => {
  it('lists all eleven Mothers of the Believers', () => {
    const list = kb.units.find(u => u.id === 'list:mothers-of-the-believers#names')?.list;
    expect(list?.items).toHaveLength(11);
    expect(list?.items.some(name => name.includes('أم حبيبة'))).toBe(true);
  });

  it('never states a total count in a cross-record list heading', () => {
    // Event titles may contain years ("… 32 هـ"); only the builder's own list headings are checked.
    for (const unit of kb.units.filter(u => u.kind === 'list')) expect(unit.list!.heading, unit.id).not.toMatch(/[0-9٠-٩]/);
  });
});
