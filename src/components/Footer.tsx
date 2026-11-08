import Link from "next/link";
import {
  IconBook,
  IconSparkles,
  IconBrain,
  IconMic,
  IconScroll,
  IconHands,
  IconCalendar,
  IconSearch,
  IconAward,
  IconHeart,
  IconMessage,
  IconUser,
  IconCheck,
  IconBookmark,
} from "@/components/icons";

const sections = [
  { href: "/quran", label: "المصحف", Icon: IconBook },
  { href: "/tafsir", label: "التفسير", Icon: IconSparkles },
  { href: "/hifz", label: "الحفظ", Icon: IconBrain },
  { href: "/tajweed", label: "التجويد", Icon: IconMic },
  { href: "/library/hadith", label: "الحديث", Icon: IconScroll },
  { href: "/adhkar", label: "الأذكار", Icon: IconHands },
] as const;

const tools = [
  { href: "/plan", label: "خطة التعلم", Icon: IconCalendar },
  { href: "/dashboard", label: "لوحة التحكم", Icon: IconUser },
  { href: "/search", label: "البحث", Icon: IconSearch },
  { href: "/quizzes", label: "الاختبارات", Icon: IconAward },
  { href: "/wird", label: "ورد اليوم", Icon: IconCheck },
] as const;

const platform = [
  { href: "/about", label: "عن رِفْق", Icon: IconHeart },
  { href: "/about/methodology", label: "منهجية المحتوى", Icon: IconScroll },
  { href: "/about#sources", label: "سياسة التوثيق", Icon: IconScroll },
  { href: "/support", label: "ادعم المشروع", Icon: IconHeart },
  { href: "/contact", label: "تواصل معنا", Icon: IconMessage },
  { href: "/privacy", label: "الخصوصية", Icon: IconScroll },
  { href: "/bookmarks", label: "المرجعيات", Icon: IconBookmark },
  { href: "/faq", label: "الأسئلة الشائعة", Icon: IconMessage },
  { href: "/auth/register", label: "إنشاء حساب", Icon: IconUser },
] as const;

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <img src="/logo.svg" alt="" className="h-9 w-9" width={36} height={36} />
              <span className="text-lg font-bold text-primary">رِفْق</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              تعلّم برفق، وافهم بعمق، واستمر بخطوات ثابتة.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">الأقسام</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {sections.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="inline-flex items-center gap-2 hover:text-primary transition-soft">
                    <s.Icon size={15} className="text-primary/80" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">أدواتك</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {tools.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="inline-flex items-center gap-2 hover:text-primary transition-soft">
                    <s.Icon size={15} className="text-primary/80" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">المنصة</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {platform.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="inline-flex items-center gap-2 hover:text-primary transition-soft">
                    <s.Icon size={15} className="text-primary/80" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} رِفْق | RIFQ — جميع الحقوق محفوظة
          </p>
          <p className="text-xs text-muted-foreground">الموثوقية قبل كثرة المحتوى</p>
        </div>
      </div>
    </footer>
  );
}
