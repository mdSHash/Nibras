const TASHKEEL = /[\u064B-\u065F\u0670]/g;

function stripTashkeel(text: string): string {
  return text.replace(TASHKEEL, '');
}

// A reference must start with its exact key ("سورة آل عمران: 144"), and the key
// must not be followed by more digits or a range, so ": 14" never matches ": 144".
export function matchQuranKey(reference: string, keys: string[]): string | null {
  const ref = stripTashkeel(reference);
  return (
    keys.find(key => {
      const k = stripTashkeel(key);
      return ref.startsWith(k) && !/^[\d-]/.test(ref.slice(k.length));
    }) ?? null
  );
}
