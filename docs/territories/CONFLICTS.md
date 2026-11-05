# Factual conflicts for Mostafa

Found in 3F. Mostafa asked (2026-11-05) for the dates to be checked and corrected on the site, so the
event **dates** below were corrected. Titles and narrated text were not changed. Page numbers are the
printed ones; the ledger has the page links. Gregorian equivalents are approximate.

## Dates corrected

`date-changes.json` lists all 35 events, each with its reason and quotes; `scripts/territories/applyDateChanges.ts --check`
confirms every quote on its page. In short:

- **Ibn Kathir agrees** on Damascus, Fahl, Jerusalem and Yarmouk (al-Bidaya, Dar Hajar, 9:584, 9:659, 9:668).
- **The date the panel shows changed (8):** Damascus 13 → Rajab 14 AH; Fahl 14 → Dhu al-Qa'da 13 AH; Jerusalem 15 → Rabi' II 16 AH; Ibn Muljam's plot "early Ramadan 40" → 40 AH; 'Ali's death 21 → 19 Ramadan 40 AH; Marj al-Saffar Jumada II → Jumada I 13 AH; al-Buwayb 14 → 13 AH; Banu al-Mustaliq 5 AH → Sha'ban 5 AH.
- **The Gregorian year the panel shows changed (9):** Tabuk 631 → 630; Yarmouk 637 → 636; Nihawand 643 → 642; 'Umrat al-Qada 628 → 629; Tustar 642 → 641; Abu Dharr 652 → 651; al-Saqatiya and the Bridge 635 → 634; Muhammad ibn Abi Bakr 659 → 658. The Hijri dates of these were right.
- **Order on the timeline only (18):** for example Banu al-Nadir now follows Bi'r Ma'una, and al-Namariq follows 'Umar's accession.

## Where the sources disagree on a date

Sunni sources give more than one date. Mostafa asked for the most accurate one (2026-11-06), so each row says what was chosen and why.

| # | Event (id) | App | Other reports |
| --- | --- | --- | --- |
| D1 | Banu al-Mustaliq and the Ifk (`ghazwat_bani_mustaliq`, `incident_ifk`) | **5 AH, Sha'ban: kept** | Sha'ban 6 AH: Ibn Ishaq (Ibn Hisham 2:289), Khalifa p. 80, al-Tabari. 5 AH: Qatada, 'Urwa, Musa ibn 'Uqba, al-Waqidi, Abu Ma'shar, reported by Ibn Hajr (Fath al-Bari 7:430) and Ibn Kathir (6:181) |
| D2 | Marj al-Saffar (`battle-marj-dabiq`) | **Jumada I 13 AH: corrected** | Muharram 14 AH (al-Baladhuri p. 121). The event's id also says "Dabiq", a different place |
| D3 | Al-Buwayb (`battle-buwaib`) | **13 AH: corrected** | Al-Tabari 3:470 gives Ramadan 13 AH and Ibn Kathir (9:597) tells it under 13 AH. Al-Baladhuri p. 249 puts the Bridge, which came first, at the end of Ramadan, so the month stays open |
| D4 | Qadisiyya (`battle-qadisiyyah`) | 15 AH | End of 16 AH: al-Baladhuri p. 252. Al-Tabari 3:590 reports 16 AH (al-Waqidi) and 15 AH (some Kufans) |
| D5 | Nihawand (`battle-nahavand`) | 21 AH | 21 AH (Ibn Ishaq, al-Waqidi), 18 AH (Sayf): al-Tabari 4:114. 19 or 20 AH: al-Baladhuri p. 298 |
| D6 | Jerusalem (`event-75`) | Rabi' II 16 AH (corrected) | 17 AH: al-Baladhuri p. 140 |
| D7 | Calendar and diwans (`event-81`) | 16 AH | Al-Baladhuri p. 439 dates the diwans to 20 AH. I found no dated passage for the calendar in the pages read. The event joins the two |
| D8 | 'Ali's death (`event-113`) | **19 Ramadan 40 AH: corrected** | Struck on 17 Ramadan (Ibn Kathir 11:22). Died with 11 nights left (al-Waqidi, Ibn Kathir 11:24). 23 Ramadan: Khalifa p. 198. 21 Ramadan appears in no passage read |
| D9 | Tustar (`conquest_tustar`) | 20 AH | 17 AH: al-Tabari's placement |
| D10 | Jalula (`conquest_jalula`) | 16 AH | 17 AH: Khalifa p. 136. 19 AH: a report in al-Tabari 4:102 |

## Narrated text that still states the wrong date

Changing narrated text hides its recording until it is recorded again, which spends quota, so these wait for Phase 4 (Mostafa, 2026-11-06).

| Event | Text says | Problem |
| --- | --- | --- |
| `battle-saqatiya` | «شعبان 13 هـ (يناير 635م)» | Sha'ban 13 AH is about October 634 |
| `ibn-muljam-plot-mecca` | «بعد حج سنة 40 هـ» (three places) | The pilgrimage of 40 AH came after 'Ali's death in Ramadan 40 AH |
| `ibn-muljam-plot-mecca`, `year-of-reconciliation` | «21 رمضان» | Now 19 Ramadan on 'Ali's own event |
| `battle-marj-dabiq` | «جمادى الآخرة 13 هـ (أغسطس 634م)» | Now Jumada I 13 AH, about July 634 |

## Where an event's title says more than the sources do

These affect the map most: the title says conquest, the source says something less.

| # | Event | Title says | Sources say | What the draft map shows |
| --- | --- | --- | --- | --- |
| 6 | `conquest_istakhr` (644.5) | Conquest of Istakhr | Abu Musa tried and could not (al-Baladhuri p. 307); Ibn 'Amir took it by force from 29 AH (p. 378) | Fars contested from 644.5, held from about 650 |
| 7 | `conquest-north-africa` (647.85) | Conquest of Ifriqiya | A raid and a payment; the commander went home and appointed no governor (p. 225); 'Uqba came in 50 AH | Treaty land only, still Byzantine-held |
| 8 | `conquest-cyprus` (649) | Conquest of Cyprus | Treaty of neutrality: Cypriots to help neither side (p. 154); second raid 33 or 35 AH | Treaty land only |
| 9 | `event-101` (651) | Conquest of Tabaristan | Sa'id ibn al-'As's raid; Muslims long stayed wary of it (p. 327) | Contested, not held |
| 10 | `conquest-nubia-baqt` (652.3) | "Raid of Nubia and the Baqt" | Agrees: a truce, not a conquest (p. 235) | Nubia stays Nubian, under treaty |

## Where the sources disagree with each other

| # | Question | Reports | Draft uses |
| --- | --- | --- | --- |
| 11 | Did Persia take Nubia about 618? | Al-Tabari says Egypt, Alexandria "and the land of Nubia" (2:182). No other passage read says so | Nubia stays Nubian; your call |
| 12 | When did Oman and Bahrain come in? | 8 AH, or 6 AH for the first envoy (al-Baladhuri pp. 84, 86) | 8 AH |
| 13 | Was Alexandria's revolt in 23 or 25 AH? | Both (al-Baladhuri p. 219) | 25 AH, which matches the app's events |
| 14 | Fustat: by force or by treaty? | Both reported, weighed (al-Baladhuri p. 212) | Muslim-held either way |

## About the sources themselves

Since you asked for verified Sunni sources only:

- **Used for who held what**: Ibn Hisham, al-Tabari, al-Baladhuri, Ibn Kathir. **For dates, as a cross-check**: Khalifa ibn Khayyat (Sunni, a hadith transmitter, one of the earliest year-by-year histories).
- **Listed for locating places only**: Yaqut's *Mu'jam al-Buldan*, al-Bakri's *Mu'jam ma Ista'jam*, plus the al-Thurayya gazetteer for coordinates (an academic dataset, not a religious source; CC BY 4.0, so it must be credited if 3G uses it). **No ledger row quotes any of the three yet.**
- **Dropped**: al-Hamdani, because his standing could not be confirmed. **Not used**: al-Ya'qubi and al-Mas'udi, on my understanding that their sympathies are Shi'i. That is from memory, not checked here.
- **Weak narrators inside the sources.** Al-Tabari and Ibn Kathir pass on reports from Sayf ibn 'Umar and Abu Mikhnaf, both criticised by hadith scholars (from memory, not checked here). The chain behind each quoted passage was **not** checked narrator by narrator, so a row marked proven means the book says it, not that its chain was graded. A hadith-trained reviewer could go further.
- **Fitna rows** record only who held which land, using the sources' own terms ("the people of Iraq", "the people of Syria"). They take no position on the dispute.
- **Edition footnotes are not used.** The Dar al-Hilal edition of al-Baladhuri has modern editor's notes with sectarian remarks, for example on p. 68. Only al-Baladhuri's own text is quoted.
- **For Phase 4**: four events cite «فتوح الشام للواقدي». From memory, scholars doubt that attribution. Not checked here and not changed.
