import Link from "next/link";

const NOTICES = {
  quran: "نص المصحف منقول من واجهة alquran.cloud برواية حفص عن عاصم قدر الإمكان، ولا يُولَّد بالذكاء الاصطناعي.",
  tafsir: "التفاسير منقولة من إصدارات معلنة الاسم (alquran.cloud وspa5k/tafsir_api) وليست توليداً آلياً. التفسير للفهم ولا يغني عن سؤال أهل العلم.",
  hadith: "الدرجة منسوبة إلى المصدر المذكور في كل حديث ولا نحكم على الأحاديث بأنفسنا. للتخريج المفصّل راجع كتب أهل الحديث.",
  adhkar: "الأذكار منقولة مع مصدرها. شارة المراجعة توضّح هل اكتمل تدقيق النص؛ تحقّق من الصيغة قبل نشرها.",
  fiqh: "ملخصات تعليمية مختصرة وليست فتوى ولا ترجيحاً لمذهب. الخلاف الفقهي يُنبَّه عليه في الملاحظات؛ ارجع لأهل العلم في حالتك الخاصة.",
  seerah: "خط زمني مختصر والتواريخ تقريبية؛ للتفاصيل ارجع إلى كتب السيرة المفصّلة المذكورة.",
} as const;

export default function SourceNotice({ kind }: { kind: keyof typeof NOTICES }) {
  return (
    <aside
      role="note"
      className="mx-auto max-w-4xl px-4 pb-10 text-xs text-muted-foreground leading-relaxed"
    >
      <div className="rounded-xl border border-border bg-muted/40 p-4">
        {NOTICES[kind]}{" "}
        <Link href="/about/methodology" className="text-primary hover:underline">
          منهجية المحتوى
        </Link>
      </div>
    </aside>
  );
}
