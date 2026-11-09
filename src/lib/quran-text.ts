/** أدوات نص المصحف — دوال نقية قابلة للاختبار */

const MARKS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;
const FORMAT_CHARS = /[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g;

export function normalizeArabic(s: string): string {
  return s
    .replace(MARKS, "")
    .replace(FORMAT_CHARS, "")
    .replace(/[\u0671\u0622\u0623\u0625]/g, "\u0627")
    .trim();
}

const BASMALA = ["بسم", "الله", "الرحمن", "الرحيم"];

/**
 * تزيل البسملة إذا كانت مضمّنة في بداية الآية الأولى للسور (عدا الفاتحة والتوبة)،
 * حتى لا تظهر مرتين مع البسملة المستقلة أعلى السورة.
 */
export function stripBismillah(
  text: string,
  surahNumber: number,
  numberInSurah: number
): string {
  if (numberInSurah !== 1 || surahNumber === 1 || surahNumber === 9) return text;

  const tokens = text.trim().split(/\s+/);
  const expected = BASMALA.join("");
  let consumed = 0;
  let normalizedPrefix = "";

  // بعض مصادر المصحف تستخدم اختلافات في رسم الألف أو علامات قرآنية
  // أو تدمج علامات الوقف مع الكلمات؛ لذلك نقارن البسملة بعد تطبيعها
  // دون الاعتماد على تطابق كل كلمة بصورة حرفية.
  while (consumed < tokens.length && normalizedPrefix.length < expected.length) {
    const normalizedToken = normalizeArabic(tokens[consumed]).replace(/[^\\u0621-\\u064A]/g, "");
    if (normalizedToken) normalizedPrefix += normalizedToken;
    consumed += 1;
    if (!expected.startsWith(normalizedPrefix)) return text;
  }

  if (normalizedPrefix !== expected) return text;
  return tokens.slice(consumed).join(" ").trim();
}

/** أرقام عربية-هندية لعلامة نهاية الآية */
export function toArabicDigits(n: number): string {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

export interface MushafTheme {
  id: string;
  name: string;
  bg: string;
  fg: string;
  accent: string;
  frame?: boolean;
}

export const MUSHAF_THEMES: MushafTheme[] = [
  { id: "classic", name: "عاجي", bg: "#fdfbf7", fg: "#1a1a1a", accent: "#1e4d2b" },
  { id: "madinah", name: "مذهّب", bg: "#fbf4df", fg: "#1f1a10", accent: "#9a7b1c", frame: true },
  { id: "sepia", name: "ورق قديم", bg: "#f1e6cc", fg: "#3b2f1e", accent: "#7a5a2a" },
  { id: "green", name: "أخضر هادئ", bg: "#eaf3ea", fg: "#16301f", accent: "#2d6a3e" },
  { id: "blue", name: "أزرق صافٍ", bg: "#eef3f8", fg: "#14263a", accent: "#2b5f8f" },
  { id: "night", name: "ليلي", bg: "#121c16", fg: "#e8e8e0", accent: "#4a9b5f" },
  { id: "black", name: "أسود", bg: "#000000", fg: "#e9e9e9", accent: "#d4af37" },
];

export interface MushafFont {
  id: string;
  name: string;
  family: string;
}

export const MUSHAF_FONTS: MushafFont[] = [
  { id: "amiri", name: "أميري", family: "'Amiri', serif" },
  { id: "amiri-quran", name: "أميري قرآن", family: "'Amiri Quran', 'Amiri', serif" },
  { id: "scheherazade", name: "شهرزاد", family: "'Scheherazade New', 'Amiri', serif" },
  { id: "naskh", name: "نسخ", family: "'Noto Naskh Arabic', 'Amiri', serif" },
  { id: "lateef", name: "لطيف", family: "'Lateef', 'Amiri', serif" },
];

export type MushafLayout = "verses" | "page";
