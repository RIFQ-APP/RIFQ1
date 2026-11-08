import type { ReviewStatus } from "@/lib/content";

export interface SeerahEvent {
  id: string;
  year: string;
  title: string;
  period: "makki" | "madani";
  summary: string;
  sources: string[];
  /** حالة المراجعة العلمية؛ الغياب = قيد المراجعة */
  reviewStatus?: ReviewStatus;
}

export const SEERAH_TIMELINE: SeerahEvent[] = [
  {
    id: "birth",
    year: "عام الفيل ≈ 570 م",
    title: "مولد النبي ﷺ",
    period: "makki",
    summary: "وُلد النبي محمد ﷺ في مكة في عام الفيل، من بني هاشم من قريش.",
    sources: ["السيرة النبوية لابن هشام", "الرحيق المختوم"],
  },
  {
    id: "prophethood",
    year: "40 من عمره ≈ 610 م",
    title: "بدء الوحي",
    period: "makki",
    summary: "نزول أول الوحي في غار حراء: اقرأ باسم ربك الذي خلق.",
    sources: ["صحيح البخاري", "ابن هشام"],
  },
  {
    id: "public",
    year: "السنة 3 للبعثة",
    title: "الجهر بالدعوة",
    period: "makki",
    summary: "بعد المرحلة السرية، أمر الله بالجهر: فاصدع بما تؤمر.",
    sources: ["ابن هشام", "الرحيق المختوم"],
  },
  {
    id: "hijra",
    year: "1 هـ ≈ 622 م",
    title: "الهجرة إلى المدينة",
    period: "madani",
    summary: "هجرة النبي ﷺ وأصحابه من مكة إلى المدينة، وبداية التقويم الهجري.",
    sources: ["صحيح البخاري", "ابن هشام"],
  },
  {
    id: "badr",
    year: "2 هـ",
    title: "غزوة بدر",
    period: "madani",
    summary: "أول مواجهة كبرى بين المسلمين وقريش، وانتصار المسلمين.",
    sources: ["ابن هشام", "تفسير ابن كثير"],
  },
  {
    id: "uhud",
    year: "3 هـ",
    title: "غزوة أحد",
    period: "madani",
    summary: "معركة عند جبل أحد، ودروس في الطاعة والصبر.",
    sources: ["ابن هشام"],
  },
  {
    id: "khandaq",
    year: "5 هـ",
    title: "غزوة الخندق",
    period: "madani",
    summary: "حفر الخندق حول المدينة عند تجمع الأحزاب.",
    sources: ["ابن هشام", "الرحيق المختوم"],
  },
  {
    id: "hudaybiyyah",
    year: "6 هـ",
    title: "صلح الحديبية",
    period: "madani",
    summary: "صلح بين المسلمين وقريش، ووصفه القرآن بالفتح المبين.",
    sources: ["صحيح البخاري", "ابن هشام"],
  },
  {
    id: "fath",
    year: "8 هـ",
    title: "فتح مكة",
    period: "madani",
    summary: "دخول مكة سلماً وعفو النبي ﷺ عن أهلها.",
    sources: ["ابن هشام", "الرحيق المختوم"],
  },
  {
    id: "wafat",
    year: "11 هـ ≈ 632 م",
    title: "وفاة النبي ﷺ",
    period: "madani",
    summary: "توفي النبي ﷺ في المدينة ودفن في حجرة عائشة رضي الله عنها.",
    sources: ["صحيح البخاري", "ابن هشام"],
  },
];

// أحداث إضافية لإثراء الخط الزمني
const EXTRA_SEERAH: SeerahEvent[] = [
  {
    id: "nursing",
    year: "الطفولة",
    title: "الرضاعة في بني سعد",
    period: "makki",
    summary: "رضع النبي ﷺ عند حليمة السعدية في البادية، وهو من عادات أشراف مكة.",
    sources: ["ابن هشام", "الرحيق المختوم"],
  },
  {
    id: "marriage-khadija",
    year: "≈ 25 من عمره",
    title: "الزواج من خديجة رضي الله عنها",
    period: "makki",
    summary: "تزوج النبي ﷺ خديجة بنت خويلد، وكانت سنداً له عند أول الوحي.",
    sources: ["ابن هشام", "الرحيق المختوم"],
  },
  {
    id: "first-believers",
    year: "أول البعثة",
    title: "السابقون إلى الإسلام",
    period: "makki",
    summary: "من أوائل من آمن: خديجة، وأبو بكر، وعلي، وزيد بن حارثة رضي الله عنهم.",
    sources: ["ابن هشام"],
  },
  {
    id: "isra",
    year: "قبيل الهجرة",
    title: "الإسراء والمعراج",
    period: "makki",
    summary: "إسراء النبي ﷺ من المسجد الحرام إلى المسجد الأقصى ثم المعراج، وفرض الصلوات الخمس.",
    sources: ["صحيح البخاري", "سورة الإسراء"],
  },
  {
    id: "badr",
    year: "2 هـ",
    title: "غزوة بدر",
    period: "madani",
    summary: "أول مواجهة كبرى بين المسلمين وقريش، وسمّاها القرآن يوم الفرقان.",
    sources: ["ابن هشام", "الرحيق المختوم"],
  },
  {
    id: "uhud",
    year: "3 هـ",
    title: "غزوة أحد",
    period: "madani",
    summary: "خرج المسلمون للدفاع عن المدينة، وفيها دروس في الطاعة والصبر.",
    sources: ["ابن هشام", "صحيح البخاري"],
  },
  {
    id: "tabuk",
    year: "9 هـ",
    title: "غزوة تبوك",
    period: "madani",
    summary: "مسير النبي ﷺ نحو تبوك في زمن عسرة، وامتحان للنفوس في الإنفاق والخروج.",
    sources: ["ابن هشام", "التوبة"],
  },
  {
    id: "hajj",
    year: "10 هـ",
    title: "حجة الوداع",
    period: "madani",
    summary: "حج النبي ﷺ حجّة واحدة، وخطب فيها خطبة بيّن فيها أصولاً عظيمة في الدماء والأموال والنساء.",
    sources: ["صحيح مسلم", "ابن هشام"],
  },
];

// دمج بدون تكرار المعرف
for (const e of EXTRA_SEERAH) {
  if (!SEERAH_TIMELINE.some((x) => x.id === e.id)) SEERAH_TIMELINE.push(e);
}
