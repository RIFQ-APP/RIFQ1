import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import {
  IconBook,
  IconMic,
  IconHands,
  IconBrain,
  IconMap,
  IconScroll,
  IconScale,
  IconAward,
  IconCalendar,
  IconSparkles,
  IconSearch,
} from "@/components/icons";

export const metadata = {
  title: "المكتبة الإسلامية",
  description: "تفسير، حديث، سيرة، فقه، تجويد",
};

const sections = [
  { title: "موسوعة التفسير", desc: "معاني الآيات من مصادر موثوقة باختيار السورة.", Icon: IconSparkles, href: "/tafsir" },
  { title: "المصحف والتلاوة", desc: "قراءة واستماع وتفسير ميسر لكل آية.", Icon: IconBook, href: "/quran" },
  { title: "أكاديمية التجويد", desc: "دروس متدرجة مع أمثلة ومراجع.", Icon: IconMic, href: "/tajweed" },
  { title: "الأذكار والأدعية", desc: "صباح ومساء وبعد الصلاة مع العداد.", Icon: IconHands, href: "/adhkar" },
  { title: "أكاديمية الحفظ", desc: "تتبع الحفظ وجلسات تفاعلية.", Icon: IconBrain, href: "/hifz" },
  { title: "السيرة النبوية", desc: "خط زمني من المولد إلى الوفاة.", Icon: IconMap, href: "/library/seerah" },
  { title: "مكتبة الحديث", desc: "أحاديث من الكتب المشهورة مع الكتاب والرقم والدرجة وحالة المراجعة.", Icon: IconScroll, href: "/library/hadith" },
  { title: "الفقه والعبادات", desc: "طهارة، صلاة، صيام، زكاة، حج.", Icon: IconScale, href: "/library/fiqh" },
  { title: "الاختبارات", desc: "راجع التجويد والسيرة والأذكار.", Icon: IconAward, href: "/quizzes" },
  { title: "خطة التعلم", desc: "تتبع يومي مرن للقراءة والحفظ.", Icon: IconCalendar, href: "/plan" },
  { title: "البحث", desc: "ابحث في القرآن والمحتوى بسرعة.", Icon: IconSearch, href: "/search" },
] as const;

export default function LibraryPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          icon={<IconScroll size={22} />}
          kicker="المكتبة"
          title="المكتبة الإسلامية"
          lead="محتوى منظم ومنسوب إلى مصادره. تظهر حالة المراجعة على كل مادة، والفتوى الشخصية لأهل العلم."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="card p-5 sm:p-6 group hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <s.Icon size={22} />
              </span>
              <h2 className="font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                {s.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.desc}</p>
              <span className="text-xs text-primary font-semibold inline-flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                افتح القسم
                <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
