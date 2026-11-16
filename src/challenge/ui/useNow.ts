import { useEffect, useState } from 'react';
import { cairoDate } from '../engine/seed';

/** Seconds until midnight in Cairo, when every daily question changes. */
export function secondsToCairoMidnight(now: Date = new Date()): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return 86400 - (Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second));
}

/** HH:MM:SS in Arabic digits. */
export function clock(seconds: number): string {
  const pad = (n: number): string => String(n).padStart(2, '0');
  const text = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
  return text.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)]);
}

/** Ticks every second: today's Cairo date and the countdown to the next question. */
export function useNow(): { today: string; left: number } {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return { today: cairoDate(now), left: secondsToCairoMidnight(now) };
}
