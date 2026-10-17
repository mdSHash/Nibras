// The battle videos (Phase 3H) as scripts/build-content.ts emits them: the
// reviewed captions, with Qur'an recitations in Quran.com text, and the
// narration script by line with its sources (content/battle-videos/<event id>/).

/** One caption as the player shows it (src/generated/battleVideoCaptions/<slug>.json). */
export interface VideoCaption {
  /** Seconds. */
  start: number;
  /** Seconds. */
  end: number;
  /** The caption text; for a recitation, Quran.com's words inside ﴿ ﴾. */
  text: string;
  /** For a recitation: the verse, e.g. `8:17`. */
  quranKey?: string;
}

/** One line of the narration script (transcript.txt) with its sources from sources.md. */
export interface VideoScriptLine {
  /** 1-based, as sources.md numbers the lines. */
  line: number;
  /** The line's captions joined (recitations in Quran.com text). */
  text: string;
  /** The Arabic book references sources.md gives for the line (English notes left out). */
  sources: string[];
}

export interface GeneratedBattleVideo {
  eventId: string;
  captions: VideoCaption[];
  lines: VideoScriptLine[];
}
