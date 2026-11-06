# Territory research (Phase 3F, built in 3G)

The basis of the territory map. The goal, from Mostafa: the map as it was in those days, rebuilt
from the chronicles the app cites, with the source noted per region and period and every uncertain
border listed. The data the app builds from is in `content/territories/`; the rest stays here.

| File | What it is |
| --- | --- |
| `content/territories/ledger/*.json` | Who held which region from when, one row per change, with sources |
| `content/territories/regions.json` | The 62 region shapes (the sources' own units: junds, kuwar, tribal lands) |
| `UNCERTAIN.md` | Generated: every row not proven, and every row with no quote |
| `BORDERS.md` | Every border line, what fixes it and how far to trust it |
| `CONFLICTS.md` | Factual conflicts for Mostafa, including event dates. Nothing was changed |
| `prototype/` | The prototype behind the 3F pictures, as text files: how the tiles were made (`make_tiles.py`) |

## What the sources can and cannot prove

**The chronicles never draw a border.** They name towns, tribes, treaties and years. So:

- **Who held a region, and from when**, is read from the sources and quoted in the ledger.
- **Where the line runs** is drawn: it follows the towns named, then coasts, rivers, mountains and
  desert edges. Every line on the map is therefore an interpretation, as the help window says.
- **Tribal lands** are pastures that moved and overlapped. They are drawn as soft areas, never as states.

## Sources

Read on [al-Maktaba al-Shamela](https://shamela.ws), whose page numbers match the print editions.

| Key | Work | Edition | Role |
| --- | --- | --- | --- |
| `futuh` | Al-Baladhuri, *Futuh al-Buldan* | Dar wa Maktabat al-Hilal, Beirut, 1988 | Who held what. Goes region by region, so it does most of the work |
| `tabari` | Al-Tabari, *Tarikh al-Rusul wa'l-Muluk* | Ed. Muhammad Abu al-Fadl Ibrahim, Dar al-Ma'arif, 2nd ed., 1387 AH | Who held what |
| `sira` | Ibn Hisham, *al-Sira al-Nabawiyya* | Ed. al-Saqqa, al-Abyari and Shalabi, al-Babi al-Halabi, 2nd ed., 1375 AH | Who held what, Prophetic period |
| `bidaya` | Ibn Kathir, *al-Bidaya wa'l-Nihaya* | Ed. al-Turki, Dar Hajar, 1st ed., 1417-1420 AH | Who held what |
| `khalifa` | Khalifa ibn Khayyat, *Tarikh* | Ed. Akram Diya al-Umari, 2nd ed., 1397 AH | Dates, as a cross-check; never the only source for a row |

Geography only, not yet quoted in any row: Yaqut's *Mu'jam al-Buldan* (`yaqut`) and al-Bakri's *Mu'jam
ma Ista'jam* (`bakri`). Coordinates: the [al-Thurayya gazetteer](https://althurayya.github.io) (CC BY
4.0, credited on the map: 3G checked the shapes against it with `scripts/territories/checkPlaces.ts`). Map shapes: [Natural Earth](https://www.naturalearthdata.com)
(public domain).

## The ledger

One JSON row per change. A region's holder at any date is its latest row at or before that date.

| Field | Meaning |
| --- | --- |
| `r` | Region id, or a list of them, from `regions.json` |
| `at` | Gregorian year with a fraction, for a row with no event; `0` means before the timeline starts (571) |
| `ev` | The event that causes the change, when the app has one. The row then has no `at`: it takes the event's `date.sortKey`, so the map stays in step with the timeline; any difference from the sources is in `CONFLICTS.md` |
| `h` | Holder: `islam`, `byz`, `sas`, `qur`, `ali`, `muawiya`, `ridda`, `ghassan`, `lakhmid`, `sasinf`, `axum`, `nubia`, `jews`, `aws`, `tribal`, `local` (local lords after Yazdegerd) |
| `k` | Kind of hold: `state`, `city`, `client` (an ally of an empire), `treaty` (terms, no direct rule), `contested`, `tribal` |
| `c` | `proven` (quoted), `likely`, `uncertain` |
| `cite` | `b` book, `p` the site's page id, `q` the exact phrase, `printed` the printed page |
| `n` | Note: why it is uncertain, what else is reported |

`npx tsx scripts/territories/checkLedger.ts` confirms every region and event id exists and that every
quoted phrase is on the page it cites, ignoring vocalization. It caught real mistakes while this was
written. It needs the network the first time; pages are cached in `tmp/`, which git ignores.
`npx tsx scripts/territories/reportLedger.ts` rewrites `UNCERTAIN.md`.

**A passing check means the book says it, not that the report is sound.** The chains of narrators
were not graded.

## What the research changed

The present map against the sources. These are the largest corrections in the draft:

| Region | Present map | Sources |
| --- | --- | --- |
| Syria, Palestine | Roman until the conquests | Held by Persia from about 614 until about 628 |
| Egypt | Roman until the conquests | Held by Persia from about 618 until about 628 |
| Al-Hira | Lakhmid or Persian, Muslim from 632.4 | Lakhmid line ended before Islam; Muslim treaty only from 633.5 |
| North Hijaz (Tabuk) | Muslim from 622 | On tribute only from 9 AH |
| Makkah, Ta'if | Muslim from 628 | Makkah 630. Ta'if after its delegation in Ramadan 9 AH, not at the failed siege |
| Palestine, Ghassan | Muslim from 632.4 | Fought from 634 to 637 |
| Egypt | Muslim from 634 | 639 to 642 |
| Iraq | Muslim from 634 | Fought from 633 to 637 |
| Ifriqiya | Muslim from 644 | A raid and a payment in 27 AH, no governor. Not held in this period |
| Cyprus | Muslim from 644 | A neutrality treaty from 28 AH |
| Fars | Muslim from 644 | Istakhr held out until about 29 AH |
| Khurasan | Muslim from 644 | Town-by-town treaties from about 30-31 AH |
| Makran | Muslim from 644 | 'Uthman sent no one there; a volunteer raid in 38-39 AH |
| Tabaristan | Not on the map | Raided, not held |
| 656-661 | One state | Ali's and Mu'awiya's lands shown apart, Egypt moving in 38 AH |

Everywhere, conquest becomes a choice of kinds: ruled, on terms, contested, or tribal land.
