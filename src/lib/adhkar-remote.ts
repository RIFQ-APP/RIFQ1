/**
 * تحميل مجموعة «حصن المسلم» الكاملة من مستودع بيانات مفتوح (rn0x/Adhkar-json)
 * عند الطلب فقط. لا نُدخل نصوصاً من عندنا: النص يُعرض كما في المصدر،
 * وحالته «قيد المراجعة» حتى يدقّقه مراجع.
 */
export interface HisnItem {
  id: string;
  text: string;
  count: number;
}
export interface HisnCategory {
  id: string;
  title: string;
  items: HisnItem[];
}

export const HISN_SOURCES = [
  "https://cdn.jsdelivr.net/gh/rn0x/Adhkar-json@main/adhkar.json",
  "https://raw.githubusercontent.com/rn0x/Adhkar-json/main/adhkar.json",
];

type Json = Record<string, unknown>;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** محلّل متسامح مع اختلاف أسماء الحقول بين نسخ البيانات */
export function parseHisnData(raw: unknown): HisnCategory[] {
  if (!Array.isArray(raw)) return [];
  const out: HisnCategory[] = [];
  raw.forEach((c, ci) => {
    if (!c || typeof c !== "object") return;
    const cat = c as Json;
    const title = str(cat.category) || str(cat.title) || str(cat.name);
    const arr = (cat.array ?? cat.items ?? cat.content) as unknown;
    if (!title || !Array.isArray(arr)) return;
    const items: HisnItem[] = [];
    arr.forEach((it, ii) => {
      if (!it || typeof it !== "object") return;
      const o = it as Json;
      const text = str(o.text) || str(o.zekr) || str(o.content);
      if (!text) return;
      const n = Number(o.count ?? o.repeat ?? 1);
      items.push({
        id: String(o.id ?? ii + 1),
        text,
        count: Number.isFinite(n) && n >= 1 && n <= 1000 ? Math.floor(n) : 1,
      });
    });
    if (items.length) out.push({ id: String(cat.id ?? ci + 1), title, items });
  });
  return out;
}
