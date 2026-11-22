# Phase 5 — «تحدي اليوم» (Nibras Daily Challenge)

Mostafa's spec, kept as written below the amendments. The plan's Phase 5 section is the task list.

## Amendment 2026-11-22 (wins over everything below)

The game sends players into Nibras: five options and **three tries** in every mode, clues unchanged;
every pick grows into a card (صح/غلط, the first sentence of its Nibras record, the tiles,
«اعرف أكتر عن <name>»; players don't know the name Nibras, so never «اعرف أكتر في نبراس»). The
result: the numbers, a big share panel (no emoji squares), «بطاقات النهارده» (a card per option into
its page), a line on what Nibras is, «العب كمان», and a fixed bar with «اعرف أكتر عن …» and «شارك».
Plan, Phase 5G.

## Amendments agreed 2026-11-15/16 (these win over the text below)

1. **Look:** redesign the game to look like part of Nibras. The prototype is a reference for behaviour,
   not for look; the direction is picked from 3–4 concept-different live prototypes (session 5D).
2. **Two doors:** a standalone page at `/Nibras/challenge/` (own entry, PWA: manifest, service
   worker, icons, offline after the first visit) for marketing, and the same game inside Nibras from
   the header and the phone ⋮ menu. Replaces "a lazy-loaded route" in section 2.
3. **Links into Nibras during play:** after each pick, right or wrong, a quiet «اعرف أكتر في نبراس»
   link about the item picked, opening in a new tab. The answer's own link only after the round.
   Replaces "never in the middle of a round" in section 1.
4. **Real stats** on the result screen (rank of the answer today, faster than X%), from a free
   Supabase project through a Vercel function; a true small-count sentence below ~20 answers.
5. **Game text:** questions and clues get game wording (smart, curiosity-raising), written for the
   game in `content/game/`, stating only facts from Nibras. Nibras records are never changed. A
   20-item sample is approved first; the rest is listed for spot checks. Replaces "shows Nibras text
   verbatim" in sections 0 and 7, except fact chips and «الحكاية باختصار», which stay verbatim.
6. **«من أكون؟» tiles:** أسلم (قبل/بعد الهجرة), مهاجر ولا أنصاري؟, اشتهر بإيه؟, عاش لحد عهد مين؟
   (hard level: death year), اتوفّى فين. Drops «من فين؟» (tribe) and «شهد بدر». The facts file
   gets these fields, each value with a Sunni source.
7. **Exclusions** also take `siege-of-uthman-house` and `abu-dharr-rabadhah`. Event ids in the spec
   are the old short ones: `event-75`, `event-49`, `event-105` are now
   `event-75-فتح-القدس-والعهدة-العمرية`, `event-49-تولي-أبي-بكر-الخلافة-السقيفة`,
   `event-105-استشهاد-عثمان-بن-عفان-يوم-الدار`.
8. **Sessions** 5A–5F (plan) replace the PR order in section 10. Leaderboard and Google sign-in are
   Phase 6; guest progress is stored so it can merge into an account.
9. `curated.py` (24 companions) calls the death region `place`; here it is `deathPlace`.

---

## 0. Before writing any code

1. Read `CLAUDE.md`, `docs/REFACTOR_PLAN.md` and `docs/REFACTOR_PROGRESS.md`. Every ground rule there applies. These matter most here:
   - **Never reword, re-vocalize, shorten or "fix" reviewed content.** The game shows Nibras text verbatim. The only change allowed is hiding the answer's name (see 4.4).
   - **No Quran text anywhere in the game.**
   - All UI is Arabic and RTL. Colors come only from the `--sys-*` tokens and `src/themeColors.ts`, using the self-hosted fonts (Tajawal for UI, Amiri for display text). Dark mode must work.
   - Every commit leaves `npm run lint`, `npm test` and `npm run build` passing.
2. Confirm that Phases 1–4 are complete according to `REFACTOR_PROGRESS.md`. If they aren't, or if this feature conflicts with the planned architecture (routing, store, folder layout), stop and ask Mostafa before you build around the conflict.
3. Use the working prototype as the reference for behavior and look. It is not code to paste: rebuild it properly in the project's stack with types and tests.
   - Live demo: https://claude.ai/artifact/Ud2B5np93UGpBvbSSCKV8B
   - Attached reference files:
     - `app.js`: the prototype game logic, in a single file.
     - `build_data.py`: how the prototype pulled data from `content/`.
     - `curated.py`: hand-entered companion facts, which still need review.

## 1. Why we are building this

Visitors stay 1–5 minutes and rarely come back. The daily challenge exists to:

- give people a reason to return every day;
- be easy to share in WhatsApp groups;
- teach something even when the player gets it wrong.

About 70–80% of the audience knows very little about this history. **The game must be fun with zero prior knowledge.** That is why it has difficulty levels, uses multiple choice everywhere, and gives hints written in plain words.

The game is a **gateway into Nibras**. It lives on its own lightweight route. The link into the rest of Nibras appears only on the result screen, never in the middle of a round.

Hard constraints:

- The site is free: no paid services, no ads, no payments.
- Nothing that works like gambling: no random rewards, loot boxes or spins.
- Never draw the Prophet ﷺ or any companion.
- **Respect:** the game must never trivialize prophetic or Islamic history. Content tied to the civil strife among the companions, and other sensitive episodes, is excluded completely (see 4.6).

## 2. Route and shell

- Add a lazy-loaded route, for example `/challenge` (Arabic label «تحدي اليوم»). It must not noticeably grow the main bundle, so check the bundle budget.
- Add a link to it from the main Nibras header.
- The minimal game shell contains:
  - A dark chrome header with «نِبْرَاس» in gold and the subtitle «تحدي اليوم».
  - A **level chip**, which shows the current level's name and icon and opens the level picker when tapped.
  - A **streak chip**: a flame icon plus the number of days in a row.
  - **Six mode tabs** in one row, each with an icon and a short label. A tab shows ✓ (won) or ✕ (lost) once today's puzzle in that mode is finished.
  - Six progress dots under the card for today's completion.

## 3. Difficulty levels

### 3.1 The level picker

- It opens automatically on the first visit as a bottom sheet:
  - Kicker: «أهلًا بيك في تحدي نبراس»
  - Title: «إنت قد إيه عارف؟»
  - Subtitle: «اختار المستوى اللي يناسبك، والأسئلة هتبقى على قدّه. تقدر تغيّره في أي وقت.»
- After that, the level chip reopens it, with the kicker «غيّر مستواك» and a «رجوع» button.
- Save the chosen level in localStorage.

### 3.2 The three levels

| id | Name | Icon | Description |
| --- | --- | --- | --- |
| `easy` | «لسه ببتدي» | seedling | «أسئلة عن أشهر الأحداث والشخصيات، ومساعدة أكتر» |
| `mid` | «عارف شوية» | star | «أسئلة متوسطة، ومساعدة أقل» |
| `hard` | «أستاذ فيها» | crown | «أي حاجة في نبراس، ومن غير مساعدة» |

### 3.3 What each level changes

| Setting | `easy` | `mid` | `hard` |
| --- | --- | --- | --- |
| Daily answers drawn from tiers | 1 | 2 | 3 + 2 |
| Clues visible at start (who / battle / place) | 2 | 1 | 1 |
| Attempts in who / battle | 4 | 4 | 3 |
| Attempts in place / time / number | 3 | 3 | 3 |
| Distractors (see 5.2) | far apart / famous | moderate | close / plausible |

- If a pool for a mode and level has fewer than 4 items, add items from the nearest tier: easy takes from 2; mid takes from 1, then 3.
- Each level has its own daily puzzle (the seed includes the level), its own saved state and its own streak.

### 3.4 Difficulty tiers

- Add an optional `difficulty: 1 | 2 | 3` field to the game data. Mostafa will review it and own it.
- Until he does, seed the field with the prototype's defaults, and list every assignment in the PR for his review.
- **Events:**
  - Tier 1: battle-badr, battle-uhud, battle-khandaq, conquest-mecca, hijra-medina, treaty-hudaybiyyah, farewell-pilgrimage, change-qibla, building-mosque, battle-khaybar, battle-hunayn, battle-tabuk, battle-mutah, battle-yarmouk, battle-qadisiyyah, year-of-sorrow, journey-taif, prophet-death, marriage-khadija, muakhat, the conquest of Jerusalem (event-75), conquest-damascus, and Abu Bakr's succession (event-49).
  - Tier 2: any other event in the Meccan, Medinan or Abu Bakr eras, plus any event with `forces` data.
  - Tier 3: everything else that is not excluded.
- **People:**
  - Tier 1: Abu Bakr, Umar, Uthman, Ali, Khalid, Hamza, Bilal, Abu Hurayrah.
  - Tier 3: Saeed ibn Zayd, Sa'd ibn Mu'adh, Abu Ayyub, Ammar, Abu Dharr, Mus'ab.
  - Tier 2: the rest of the curated list.
- **Cities:**
  - Tier 1: Makkah, Madinah, Jerusalem, Damascus, Baghdad.
  - Tier 3: Kairouan, Cordoba.
  - Tier 2: the rest.

## 4. Data, generated at build time from `content/`

Write a script in `scripts/` that runs as part of the build or through npm. It generates the game dataset from `content/events`, `content/people` and `content/cities`. Validate the output with zod, the same way `validate:content` does.

### 4.1 Events

For each event, take:

- `title`, `summary`, `courseOfEvents`, `eraId`, `isBattle`, the `keyFigures` labels, and `forces.army` / `forces.enemyArmy` (`value` and `textAr`).
- `date.labelAr` → a Hijri year as an integer:
  - `ق.هـ` years are negative, and there is no year 0.
  - If the label contains `وقيل`, mark the year as disputed.
- `location.nameAr` and `location.coordinates`.
- The **kind** (غزوة / سرية / معركة / فتح / موقعة), taken from the first word of the title.

Skip any event without a parseable year or without coordinates. Print every exclusion and its reason.

### 4.2 People

- Clues come from the `bio` sentences, `title` and `role`.
- The death year comes from `birthDeath`.
- `aliases` are used for name matching inside the masking.

### 4.3 Cities

Clues come from the `description` and `significance` sentences.

### 4.4 Hiding the answer inside clues

- Replace the answer's name tokens with `ـــ`. The matching must ignore diacritics and tatweel, treat alef variants as one letter, and treat ة as ه and ى as ي.
- After masking, **drop any clue** that:
  - still contains a distinctive name token; or
  - has fewer than about 12 letters left once the mask is removed.
- Order clues from vague to specific. For people, use this order: later bio sentences, then the first bio sentence, then `title`, then `role` (role and title usually give the person away).
- Print every clue that was dropped for leaking the name.

### 4.5 Curated companion facts (new reviewed content)

- Create `content/game/companion-facts.json` with its own schema, and add a check that every id exists in `content/people`.
- Fields per person:
  - `grp`: قريش / الأنصار / غير ذلك
  - `isl`: قبل الهجرة / بعد الهجرة
  - `badr`: نعم / لا
  - `deathPlace`: a region (المدينة, مكة, الحجاز, الشام, العراق, مصر, بلاد الروم, …)
  - Keep `clan` and `ten` in the file for possible later use. The game does not show them.
- Seed the file from the attached `curated.py`, which covers 24 companions.
- **These values were typed by hand and are not reviewed yet.**
  - In the PR, list every value so Mostafa can check it against the site's Sunni sources.
  - **Do not enable the «من أكون؟» mode in production until he approves the file.**
- Never derive these facts from keywords in the bios. That was tried, and the results were unreliable.

### 4.6 Exclusions

Remove these from every pool **and** from every list of distractors:

- every event in the `ali` era, which covers the fitna period, Jamal and Siffin;
- the Ifk incident (`incident_ifk`);
- the martyrdom of Uthman (event-105);
- `year-of-passing-32ah`.

Keep the exclusion list in one config file so it is easy to extend.

## 5. Gameplay: every mode is multiple choice

**No free-text input anywhere.** Every answer is one of **4 options**.

### 5.1 Rules shared by all modes

- A wrong pick:
  - uses one attempt;
  - **opens the next clue or hint**;
  - shows a plain-words explanation of how the answer differs.
- **The wrong option stays enabled.** Picking it again is allowed and uses another attempt.
- Options are generated deterministically from the daily seed. Practice rounds use a random seed.
- The attempt bar sits above the card and shows used attempts (gold) and the winning attempt (green).

### 5.2 Distractor rules

Distractors must be **real items from Nibras data**, unique, and never the answer.

| Mode | Distractors |
| --- | --- |
| who | Other curated people, preferring the same tier as the answer. |
| battle | Other battles, preferring the same tier. |
| place | 3 other cities. |
| time | The answer year shifted by offsets that depend on the level, skipping year 0 and never landing within ±1 of a disputed answer. Easy offsets: ±5, 7, 9, 12, 15, 20. Mid: ±2, 3, 4, 6, 8. Hard: ±1, 2, 3, 4. Show the options sorted chronologically. |
| number | The answer multiplied by a level-dependent factor, then rounded to a "nice" number (2 significant digits, or a whole number under 30). Easy factors: ×0.25, 0.4, 2.5, 4, 6. Mid: ×0.5, 0.65, 1.5, 1.9, 2.5. Hard: ×0.75, 0.85, 1.2, 1.35, 1.5. Each option must differ from the answer by more than 7%. Show them sorted ascending. |
| full: name | Other events, preferring the same tier and the same kind or era. |
| full: place | Locations of other events with distinct names, preferring the answer's tier. Keep a minimum spacing between all four: easy 300 km, mid 150 km, hard 40 km. |

### 5.3 The six modes

#### «من أكون؟» (who)

- The prompt is «مين الشخصية دي؟». Show the clues, then 4 name options.
- Each guess shows a row of **5 tiles**. Each tile shows the guess's value, colored by comparison with the answer:

| Tile | Values | Colors |
| --- | --- | --- |
| من فين؟ | قريش / الأنصار / قبيلة تانية | green if the same, red if different |
| أسلم | قبل / بعد الهجرة | green / red |
| شهد بدر | نعم / لا | green / red |
| مات في | region | green if the same; yellow if both are in the Hijaz (مكة / المدينة / الحجاز); otherwise red |
| سنة الوفاة | year | green if the same; yellow if within 5 years; otherwise red; with a sub-line «↑ مات بعده» or «↓ مات قبله» |

- **Under every wrong row, show a plain-words hint:** «اللي بندوّر عليه: …». Build it from the comparisons, for example «مش من قريش، أسلم قبل الهجرة، شهد بدر، مات بعده». This sentence matters more than the colors.
- Legend: «زي الإجابة» (green), «قريب منها» (yellow), «مختلف» (red).
- Do not use the tribe or clan, «من العشرة», or any metric internal to Nibras. Ordinary players can't reason about those.

#### «معركة اليوم» (battle)

- The prompt is «أنهي معركة دي؟». Show the clues (masked summary and `courseOfEvents` lines), then 4 options.
- Tiles:

| Tile | Colors |
| --- | --- |
| السنة | green if the same; yellow if within 2 years; otherwise red; with «↑ حصلت بعدها» or «↓ حصلت قبلها» |
| العهد (era name) | green if the same; yellow if adjacent; otherwise red |
| النبي ﷺ فيها؟ | «نعم» when the kind is غزوة or the event is the conquest of Mecca; green / red |
| المسافة | km between the guess and the answer, with a direction arrow; green under 30 km, yellow under 400 km, otherwise red |

- The plain-words hint follows the same idea, for example: «حصلت قبلها، في عهد تاني، النبي ﷺ كان فيها، مكانها على بعد ٥٢٠ كم ناحية الجنوب». Map the bearing to one of 8 Arabic direction words.

#### «مكان اليوم» (place)

- The prompt is «أنهي مدينة دي؟». Show the clues.
- Show a **map with 4 numbered pins**, one per option. Under the map, show 4 buttons with the same numbers and the city names. The player picks by tapping either a pin or a button.
- A wrong pick:
  - turns that pin red;
  - opens a clue;
  - shows «✕ مش X — المدينة اللي بندوّر عليها على بعد N كم منها ناحية ال…».

#### «زمان اليوم» (time)

- The prompt is «الحدث ده حصل سنة كام؟». Show the event title and summary verbatim, then 4 year options in a 2×2 grid.
- A wrong pick shows «✕ مش X — حصل بعد كده ↑» or «… قبل كده ↓». **Never reveal how big the gap is.**

#### «رقم اليوم» (number)

- Questions come from `forces`:
  - «كم كان عدد جيش المسلمين في «…»؟» for `army`;
  - «كم كان عدد جيش العدو في «…»؟» for `enemyArmy`.
  - When the text is about ships, use «مراكب» instead of «جيش».
- Skip texts like «لم يحضروا».
- Show 4 number options in a 2×2 grid.
- A wrong pick shows «الرقم الصح أكبر من كده ↑» or «أصغر ↓».
- The result screen shows `textAr` verbatim.

#### «الحدث الكامل» (full event, 100 points)

- Show a masked excerpt from `courseOfEvents`. If it is too short, add the masked summary in front of it.
- Then there are 3 stages. Each stage gives 2 tries: right on the first try earns full points, right on the second earns half, and two wrong picks earn 0 and move on.

| Stage | Points | Options | After a wrong pick |
| --- | --- | --- | --- |
| Name | 40 | 4 event names | Shows a clue |
| Place | 30 | 4 numbered pins plus buttons | «✕ مش X — المكان الصح على بعد N كم منه ناحية ال…» |
| Year | 30 | 4 years | Before/after hint |

- After the place stage, show the true spot as a gold star with its name.
- Show stage chips at the top (الاسم / المكان / الزمان), each with its earned points, plus a running score.
- A round counts as "won" (for the streak and the ✓) at 60 points or more.

## 6. Map

- Use Leaflet with the site's own relief tiles (`public/map-tiles/relief-{light|dark}`).
- **Nothing else on the map:** no labels, territories or Nibras markers. Show only the 4 numbered option pins and, after the answer, the gold star.
- Fit the map to the pins with padding, and keep the region bounded.
- Keep the Natural Earth credit, as the main map does.
- Load the map code only for the modes that use it.

## 7. Result screen

It must feel rewarding, and **it must not contain any emoji or colored-square grid.** From top to bottom:

1. **Hero band** in a dark chrome gradient:
   - A gold medal that pops in: a check mark on a win, the score in «الحدث الكامل», or a grey book icon on a loss.
   - A headline based on performance: «عبقري!» (first try), «ممتاز!» (2), «أحسنت!» (3–4), «في آخر لحظة!», or «المرة دي فلتت منك».
   - A plain line under it, for example «عرفتها من المحاولة التالتة».
   - Light flat confetti on a win.
2. **The answer:** a label (الشخصية كانت / الحدث كان / المدينة كانت / الإجابة) and the name in large Amiri.
3. **Fact chips**, verbatim from the content: for events, `date.labelAr`, `location.nameAr` and the era name; for people, `role` and the death year.
4. **«الحكاية باختصار»:** the verbatim summary, or the first two bio sentences, or the city description.
5. **Three stat tiles:** attempts (or points), «أيام ورا بعض» (the streak) and «تحديات النهارده X من 6».
6. **Three buttons:**
   - «شارك نتيجتك مع صحابك»: use the Web Share API, falling back to the clipboard with «اتنسخت» feedback.
   - «اعرف القصة كاملة في نبراس»: a **deep link** to the actual event, person or city page through the existing router, not to the home page.
   - «العب جولة تانية»: a practice round with a random seed. It does not affect the streak or today's saved state.
7. **A live countdown** to the next puzzle, as HH:MM:SS in Arabic digits.
8. **A small link** to the next unfinished mode: «ولا كمّل على «…» ←».

**Share text** is a plain sentence that mentions the level, with no spoilers and no grid. For example:

> عرفت من أكون؟ على نبراس في ٣ محاولات (مستوى «لسه ببتدي») 🔥 ٥ أيام ورا بعض
> تقدر تعمل أحسن مني؟ <link>

## 8. Daily seed and persistence

- The answer for each mode, level and day is chosen by a hash of: the date in the Cairo time zone, a salt for the mode, and a salt for the level.
- The puzzle number is the number of days since launch.
- Options use the same seed, so everyone sees the same 4 options in the same order.
- localStorage, wrapped in try/catch and versioned, holds:
  - the chosen level;
  - the state of each level and mode for today;
  - a streak per level. The first finished win of the day counts. The streak goes up if the previous win was yesterday; otherwise it resets to 1.
- Type the saved data as `GameResult` / `DailyState`. Mostafa will move it into accounts and a leaderboard later, so **do not build accounts or a leaderboard now.**

## 9. Quality bar

- **Unit tests:**
  - year parsing (ق.هـ, وقيل, no year 0) and `yearDiff`;
  - the seed is stable for a given date and level;
  - option generators: always exactly 4 unique options, the answer included, distractors that follow the level rules, no year 0, numbers more than 7% away from the answer;
  - scoring for every mode, including half points on a second try;
  - masking leaves no name tokens;
  - the exclusions are applied.
- **Content report:** the data script prints excluded items, clues dropped for leaking, and a count per mode, level and tier. Warn when a pool has fewer than 4 items.
- **Playwright:** on a 390 px viewport, play one round of every mode at every level until the result screen appears, with no console errors.
- **Visual snapshots:** the level picker and the result screen, in light and dark mode.
- **Performance:** the route stays light on a phone.

## 10. PR order (stop after each one and summarize for Mostafa)

1. Data script, schemas, the curated facts file, the difficulty tiers, the exclusion config, and the content report. Include the review lists for Mostafa.
2. Game engine: seed, level config, option generators, scoring, persistence. Fully unit-tested.
3. Route, shell, level picker, and the «زمان», «رقم» and «معركة» modes.
4. Map modes: «مكان» and «الحدث الكامل».
5. «من أكون؟», behind a flag until the curated facts are approved.
6. Result screen polish, sharing, deep links, and the header link.

After each PR, tell Mostafa what changed, what he needs to review (tiers, curated facts, exclusions), and anything you were unsure about.
