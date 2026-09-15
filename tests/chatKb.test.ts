import { beforeAll, describe, expect, it } from 'vitest';
import committedKb from '../public/data/chat-kb.json';
import quranData from '../src/quranData.json';
import { eventsData } from '../src/data';
import type { ChatKb } from '../shared/chatKb';
import { buildChatKb } from '../scripts/build-chat-kb';
import { BuildContext, mentionsQuantity } from '../scripts/chat-kb/common';

let kb: ChatKb;
let ctx: BuildContext;

beforeAll(() => {
  ({ kb, ctx } = buildChatKb());
}, 60000);

describe('knowledge base build', () => {
  it('matches the committed public/data/chat-kb.json (run npm run build:chat-kb after data changes)', () => {
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

  it('reports only the known Badr scenario misquote as an error', () => {
    const errors = ctx.issues.filter(i => i.severity === 'error');
    expect(errors).toHaveLength(1);
    expect(errors[0].source).toMatch(/^battle:badr#description:/);
    expect(errors[0].message).toContain('يَوْمُ');
    expect(kb.units.some(u => u.id === errors[0].source)).toBe(false);
  });
});

describe('verbatim guarantees', () => {
  it('stores every verse exactly as src/quranData.json has it', () => {
    const verses = kb.units.filter(u => u.kind === 'quran_verse');
    expect(verses).toHaveLength(Object.keys(quranData).length);
    for (const unit of verses) {
      expect(unit.text).toBe((quranData as Record<string, { text: string }>)[unit.refs.quranKey!].text);
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
      (event.details.companion_roles ?? []).forEach((role, i) => {
        expect(byId.get(`event:${event.id}#role:${i}`)?.text).toContain(role.role_in_event.replace(/\s+/g, ' ').trim());
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
    const battleUnits = kb.units.filter(u => u.trust === 'secondary' && !u.list);
    expect(battleUnits.length).toBeGreaterThan(100);
    for (const unit of battleUnits) expect(mentionsQuantity(unit.text), unit.id).toBe(false);
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
