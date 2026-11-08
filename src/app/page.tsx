import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ADHKAR } from "@/lib/data/adhkar";
import { TAJWEED_LESSONS } from "@/lib/data/tajweed";
import { FIQH_TOPICS } from "@/lib/data/fiqh";
import { SEERAH_TIMELINE } from "@/lib/data/seerah";
import { QUIZ_QUESTIONS } from "@/lib/data/quizzes";
import {
  IconBook,
  IconBrain,
  IconSparkles,
  IconMic,
  IconScroll,
  IconHands,
  IconSearch,
  IconCheck,
} from "@/components/icons";

const features = [
  {
    href: "/quran",
    title: "المصحف الإلكتروني",
    desc: "قراءة مرتبة مع حفظ موضعك والتلاوة الصوتيّة.",
    Icon: IconBook,
  },
  {
    href: "/hifz",
    title: "الحفظ والمراجعة",
    desc: "جلسات تفاعلية وتتبع تقدّمك يوماً بيوم.",
    Icon: IconBrain,
  },
  {
    href: "/tafsir",
    title: "التفسير",
    desc: "معاني الآيات من مصادر موثوقة باختيار السورة.",
    Icon: IconSparkles,
  },
  {
    href: "/tajweed",
    title: "أكاديمية التجويد",
    desc: "دروس متدرجة من المخارج إلى أحكام النون.",
    Icon: IconMic,
  },
  {
    href: "/library/hadith",
    title: "مكتبة الحديث",
    desc: "مختارات رِفْق وآلاف الأحاديث من الكتب الستة.",
    Icon: IconScroll,
  },
  {
    href: "/adhkar",
    title: "الأذكار والأدعية",
    desc: "أذكار الصباح والمساء والنوم وغيرها.",
    Icon: IconHands,
  },
  {
    href: "/search",
    title: "البحث",
    desc: "ابحث في القرآن والمحتوى الإسلامي بسرعة.",
    Icon: IconSearch,
  },
  {
    href: "/wird",
    title: "ورد اليوم",
    desc: "تتبع قراءتك وأذكارك وسلسلة أيامك.",
    Icon: IconCheck,
  },
] as const;

const paths = [
  {
    title: "أبدأ من الصفر",
    desc: "تعرّف على المصحف والتجويد والأذكار بخطوات صغيرة.",
    steps: [
      { label: "المصحف", href: "/quran" },
      { label: "مقدمة التجويد", href: "/tajweed" },
      { label: "أذكار الصباح", href: "/adhkar" },
    ],
  },
  {
    title: "أريد الحفظ والمراجعة",
    desc: "سجّل ما حفظته وراجعه بانتظام وتابع تقدّمك.",
    steps: [
      { label: "أكاديمية الحفظ", href: "/hifz" },
      { label: "ورد اليوم", href: "/wird" },
      { label: "خطة التعلم", href: "/plan" },
    ],
  },
  {
    title: "أريد الفهم",
    desc: "اقرأ التفسير وقارن بين المصادر وتعلّم السيرة والفقه.",
    steps: [
      { label: "التفسير", href: "/tafsir" },
      { label: "السيرة النبوية", href: "/library/seerah" },
      { label: "الفقه والعبادات", href: "/library/fiqh" },
    ],
  },
] as const;

const stats = [
  { n: 114, label: "سورة" },
  { n: TAJWEED_LESSONS.length, label: "درس تجويد" },
  { n: ADHKAR.length, label: "ذكر ودعاء" },
  { n: FIQH_TOPICS.length, label: "موضوع فقهي" },
  { n: SEERAH_TIMELINE.length, label: "حدث في السيرة" },
  { n: QUIZ_QUESTIONS.length, label: "سؤال اختبار" },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-secondary/30 to-background pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-primary/20 to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 ring-1 ring-primary/15 px-3.5 py-1.5 text-xs font-semibold text-primary mb-6">
              منصة إسلامية تعليمية
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
              رِفْق
              <span className="block text-primary text-2xl sm:text-3xl mt-2.5 font-semibold">
                تعلّم برفق · افهم بعمق · استمر بثبات
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-9">
              مكان واحد للقرآن والحفظ والتفسير والتجويد والحديث والأذكار —
              بتجربة هادئة تناسب يومك ومستواك.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/quran" className="btn-primary px-6 py-3 text-sm">
                افتح المصحف
              </Link>
              <Link
                href="/hifz"
                className="px-6 py-3 rounded-xl bg-card border border-border font-medium text-sm shadow-sm hover:bg-muted hover:border-primary/30 transition-soft"
              >
                ابدأ الحفظ
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary/5 transition-soft"
              >
                إنشاء حساب مجاني
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card/50">
          <div className="mx-auto max-w-6xl px-4 py-7 grid grid-cols-3 sm:grid-cols-6 gap-4 text-center">
            {stats.map((x) => (
              <div key={x.label} className="group">
                <div className="text-xl sm:text-2xl font-bold text-primary tabular-nums group-hover:scale-105 transition-transform">
                  {x.n}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{x.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">من أين أبدأ؟</h2>
            <p className="text-muted-foreground text-sm">اختر المسار الأقرب لهدفك اليوم</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {paths.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <h3 className="font-semibold mb-1 text-foreground">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                <ol className="space-y-2.5 text-sm">
                  {p.steps.map((st, i) => (
                    <li key={st.href} className="flex items-center gap-3">
                      <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/10">
                        {i + 1}
                      </span>
                      <Link href={st.href} className="hover:text-primary hover:underline underline-offset-2 transition-colors">
                        {st.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-muted-foreground text-sm">
              أدوات حقيقية للاستخدام اليومي — لا مجرد صفحات ثابتة
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.Icon size={22} />
                </span>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-soft">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-14 grid gap-8 md:grid-cols-3">
            {[
              {
                t: "موثوقية المحتوى",
                d: "لكل نص مصدره، مع شارة توضّح حالة مراجعته العلمية، وفصل بين النص والشرح.",
              },
              {
                t: "تجربة شخصية",
                d: "حفظ التقدّم، المفضلة، وخطط تناسب وقتك.",
              },
              {
                t: "واجهة عربية راقية",
                d: "تصميم RTL هادئ يصلح للكبار والصغار.",
              },
            ].map((x) => (
              <div key={x.t}>
                <h3 className="font-semibold mb-2">{x.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-3">ابدأ اليوم بخطوة واحدة</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
            افتح سورة، أو راجع وردك، أو اقرأ ذكر الصباح — الاستمرار أهم من الكثرة.
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            <Link href="/about/methodology" className="text-primary hover:underline">
              اقرأ منهجية المحتوى
            </Link>{" "}
            · <Link href="/faq" className="text-primary hover:underline">الأسئلة الشائعة</Link>
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/quran/1"
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
            >
              سورة الفاتحة
            </Link>
            <Link
              href="/wird"
              className="px-6 py-3 rounded-xl border border-border text-sm font-medium"
            >
              ورد اليوم
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
