/** مصادر التفسير المتاحة عبر واجهات برمجية موثوقة */

export interface TafsirEdition {
  id: string;
  name: string;
  author: string;
  provider: "alquran" | "spa5k";
  /** معرف الـ API */
  slug: string;
  level: "easy" | "medium" | "advanced";
  description: string;
}

export const TAFSIR_EDITIONS: TafsirEdition[] = [
  {
    id: "muyassar",
    name: "التفسير الميسر",
    author: "مجمع الملك فهد",
    provider: "alquran",
    slug: "ar.muyassar",
    level: "easy",
    description: "تفسير ميسر بأسلوب واضح مناسب للجميع",
  },
  {
    id: "jalalayn",
    name: "تفسير الجلالين",
    author: "الجلال المحلي والسيوطي",
    provider: "alquran",
    slug: "ar.jalalayn",
    level: "easy",
    description: "تفسير مختصر مشهور جداً",
  },
  {
    id: "saadi",
    name: "تفسير السعدي",
    author: "عبد الرحمن بن ناصر السعدي",
    provider: "spa5k",
    slug: "ar-tafsir-as-saadi",
    level: "easy",
    description: "تفسير سهل ومركّز على الهداية",
  },
  {
    id: "mukhtasar",
    name: "المختصر في التفسير",
    author: "مركز تفسير",
    provider: "spa5k",
    slug: "ar-tafsir-al-mukhtasar",
    level: "easy",
    description: "مختصر معاصر واضح المعنى",
  },
  {
    id: "ibn-kathir",
    name: "تفسير ابن كثير",
    author: "الحافظ ابن كثير",
    provider: "spa5k",
    slug: "ar-tafsir-ibn-kathir",
    level: "advanced",
    description: "من أشهر التفاسير بالمأثور",
  },
  {
    id: "qurtubi",
    name: "تفسير القرطبي",
    author: "القرطبي",
    provider: "alquran",
    slug: "ar.qurtubi",
    level: "advanced",
    description: "تفسير جامع يعتني بالأحكام",
  },
  {
    id: "baghawi",
    name: "تفسير البغوي",
    author: "البغوي",
    provider: "alquran",
    slug: "ar.baghawi",
    level: "medium",
    description: "تفسير أثري متوسط الحجم",
  },
  {
    id: "waseet",
    name: "التفسير الوسيط",
    author: "مجموعة من العلماء",
    provider: "alquran",
    slug: "ar.waseet",
    level: "medium",
    description: "تفسير وسيط معاصر",
  },
];

export async function fetchTafsir(
  surah: number,
  ayah: number,
  edition: TafsirEdition
): Promise<{ text: string; source: string } | null> {
  try {
    if (edition.provider === "alquran") {
      const res = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${edition.slug}`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) return null;
      const data = await res.json();
      const text = data.data?.text;
      if (!text) return null;
      return {
        text,
        source: `${edition.name} — ${edition.author}`,
      };
    }

    // spa5k
    const res = await fetch(
      `https://cdn.jsdelivr.net/gh/spa5k/tafsir_api@main/tafsir/${edition.slug}/${surah}/${ayah}.json`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.text) return null;
    return {
      text: data.text,
      source: `${edition.name} — ${edition.author}`,
    };
  } catch {
    return null;
  }
}

export function getEdition(id: string) {
  return TAFSIR_EDITIONS.find((e) => e.id === id);
}
