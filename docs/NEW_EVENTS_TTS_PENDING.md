# Events Pending TTS Cache

Newly added events that have NOT yet had their audio pre-generated.
The two commands that consume this list:

```bash
npm run cache-audio          # scripts/cache-event-audio.js   — title + summary
npm run cache-details        # scripts/cache-details-audio.js — full_description panel
```

Both scripts iterate `src/dataList.json` in source order and cache-hit on file existence,
so no code change is needed to pick up new events — this file is a **human checklist**
for me/you to remember which entries have not yet been through the cache run.

When an event's audio has been generated and verified, tick both boxes and move it to the
"cached" section at the bottom.

---

## Pending — Uthman / Ali chapters batch (July 2026 build)

| # | ID | Title (AR) | Era | Year | title cache | details cache |
|:-:|---|---|---|:-:|:-:|:-:|
| N1  | `alexandria-reconquest`         | إعادة فتح الإسكندرية                              | عثمان | 25هـ | ☐ | ☐ |
| N2  | `conquest-rayy-jurjan`          | إتمام فتح فارس (الري وجرجان)                     | عثمان | 25-26هـ | ☐ | ☐ |
| N3  | `first-muslim-fleet`            | بناء الأسطول الإسلامي الأول                       | عثمان | 28هـ | ☐ | ☐ |
| N4  | `conquest-sijistan`             | فتح سجستان وبدء الطريق إلى كابل                  | عثمان | 30هـ | ☐ | ☐ |
| N5  | `conquest-nubia-baqt`           | فتح النوبة وعقد البقط                             | عثمان | 31هـ | ☐ | ☐ |
| N6  | `abu-dharr-rabadhah`            | رحيل أبي ذر الغفاري إلى الربذة                    | عثمان | 30-32هـ | ☐ | ☐ |
| N7  | `year-of-passing-32ah`          | سنة الرحيل — وفاة الأعلام الستة                   | عثمان | 32هـ | ☐ | ☐ |
| N8  | `wufud-amsar-complaints`        | قدوم وفود الأمصار وتفاقم الشكاوى                 | عثمان | 34هـ | ☐ | ☐ |
| N9  | `siege-of-uthman-house`         | حصار دار عثمان                                    | عثمان | 35هـ | ☐ | ☐ |
| N10 | `march-to-basra-pre-jamal`      | مسير عائشة وطلحة والزبير إلى البصرة              | علي   | 36هـ | ☐ | ☐ |
| N11 | `muawiyah-refuses-bayah`        | رفض معاوية البيعة والمطالبة بدم عثمان            | علي   | 36هـ | ☐ | ☐ |
| N12 | `ammar-martyrdom-siffin`        | استشهاد عمار بن ياسر في صفين                     | علي   | 37هـ | ☐ | ☐ |
| N13 | `raising-mushafs-siffin`        | رفع المصاحف في صفين                               | علي   | 37هـ | ☐ | ☐ |
| N14 | `ibn-abbas-debates-khawarij`    | مناظرة ابن عباس للخوارج بحروراء                  | علي   | 37-38هـ | ☐ | ☐ |
| N15 | `muhammad-abi-bakr-egypt`       | استشهاد محمد بن أبي بكر وسقوط مصر                | علي   | 38هـ | ☐ | ☐ |
| N16 | `muawiyah-raids-iraq-hijaz`     | غارات جيش معاوية على العراق والحجاز              | علي   | 39هـ | ☐ | ☐ |
| N17 | `ibn-muljam-plot-mecca`         | مؤامرة ابن ملجم في مكة                            | علي   | 40هـ | ☐ | ☐ |
| N18 | `year-of-reconciliation`        | صلح الحسن ومعاوية (عام الجماعة)                  | ما بعد | 41هـ | ☐ | ☐ |

---

## Cached — verified in `public/audio/`

_(empty — nothing here yet for this batch)_
