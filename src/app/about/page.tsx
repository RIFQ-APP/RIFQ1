import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { IconHeart, IconBook, IconSparkles } from "@/components/icons";

export const metadata: Metadata = {
  title: "عن رِفْق",
  description: "تعرف على رؤية منصة رِفْق ومبادئها ومصادرها",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-14">
          <PageHeader
            icon={<IconHeart size={22} />}
            kicker="من نحن"
            title="عن منصة رِفْق"
            lead="رِفْق منصة إسلامية تعليمية تساعدك على قراءة القرآن الكريم، وحفظه، ومراجعته، وفهم معانيه، وتعلّم التجويد، مع مكتبات للحديث والأذكار والسيرة والفقه."
          />

          <div className="rounded-2xl border border-border bg-card p-6 mb-8">
            <h2 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <IconSparkles size={18} className="text-primary" />
              الشعار المعنوي
            </h2>
            <p className="text-primary font-medium text-lg">
              «تعلّم برفق، وافهم بعمق، واستمر بخطوات ثابتة»
            </p>
          </div>

          <h2 className="font-semibold text-lg mb-3">المبادئ</h2>
          <ul className="space-y-3 text-muted-foreground mb-10">
            <li className="flex gap-3">
              <span className="text-primary font-bold">1</span>
              <span>الموثوقية قبل كثرة المحتوى: لا نص بلا مصدر، ولا نعدّه مراجَعاً إلا بعد مراجعة فعلية</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">2</span>
              <span>الوظائف الحقيقية قبل المظاهر: أدوات تُستخدم يومياً لا صفحات للعرض</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-bold">3</span>
              <span>سهولة الاستمرار قبل كثرة التعقيدات: خطوات صغيرة ثابتة تناسب وقتك</span>
            </li>
          </ul>

          <h2 className="font-semibold text-lg mb-3">ماذا تجد في رِفْق؟</h2>
          <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground mb-10">
            <li>• المصحف مع التلاوة الصوتية وحفظ موضع القراءة</li>
            <li>• الحفظ والمراجعة مع تتبع التقدّم</li>
            <li>• التفسير من عدة مصادر مع وضع المقارنة</li>
            <li>• أكاديمية التجويد بدروس متدرجة</li>
            <li>• الحديث والأذكار والسيرة والفقه</li>
            <li>• اختبارات وخطة تعلم وورد يومي</li>
          </ul>

          <h2 className="font-semibold text-lg mb-3">حدود المنصة</h2>
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground leading-relaxed mb-10 space-y-2">
            <p>• لا نولّد آيات ولا أحاديث ولا تفاسير بالذكاء الاصطناعي؛ كل نص منقول من مصدره.</p>
            <p>• التجويد النظري لا يغني عن التلقي من مقرئ مجاز.</p>
            <p>• مختصرات الفقه تعليمية وليست فتوى ولا ترجيحاً لمذهب.</p>
            <p>
              • شارة «قيد المراجعة» تعني أن النص لم يُراجَع بعد مراجعة علمية نهائية؛ التفاصيل في{" "}
              <Link href="/about/methodology" className="text-primary hover:underline">
                منهجية المحتوى
              </Link>
              .
            </p>
          </div>

          <h2 id="sources" className="font-semibold text-lg mb-3 scroll-mt-24">
            المصادر والتوثيق
          </h2>
          <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground leading-relaxed mb-10 space-y-2">
            <p>• نص القرآن من مصادر رقمية معتمدة شائعة الاستخدام في التطبيقات القرآنية.</p>
            <p>• التفاسير من إصدارات معروفة (مثل التفسير الميسّر وغيره حسب المتاح).</p>
            <p>• الأحاديث من كتب مشهورة مع ذكر المصدر عند العرض.</p>
            <p>• يُفصَل دائماً بين النص الأصلي وبين الشرح أو الترجمة.</p>
            <p>• لا يُستبدل حكم شرعي أو فتوى شخصية بمنصة تعليمية؛ راجع أهل العلم عند الحاجة.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/support" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
              <IconHeart size={16} />
              ادعم المشروع
            </Link>
            <Link href="/quran" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm font-medium">
              <IconBook size={16} />
              ابدأ بالمصحف
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
