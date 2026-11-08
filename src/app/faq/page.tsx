import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { IconMessage } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة",
  description: "أسئلة متكررة حول منصة رِفْق",
};

const faqs = [
  {
    q: "هل رِفْق مجاني؟",
    a: "نعم، الاستخدام الأساسي للقرآن والحفظ والتفسير والمكتبة مجاني.",
  },
  {
    q: "هل أحتاج حساباً؟",
    a: "لا. يمكنك القراءة واستخدام الورد والمرجعيات وتتبع الحفظ محلياً على جهازك بدون حساب. الحساب يفيد لحفظ التقدّم والمفضلة على الخادم.",
  },
  {
    q: "من أين يأتي نص القرآن والحديث؟",
    a: "من مصادر رقمية معروفة وشائعة في التطبيقات القرآنية، مع ذكر المصدر عند عرض الحديث والتفسير قدر الإمكان.",
  },
  {
    q: "ماذا تعني شارة «قيد المراجعة»؟",
    a: "تعني أن النص منقول من مصدر مذكور لكنه لم يُراجَع مراجعة علمية نهائية بعد. لا نعلّم المحتوى «مراجَعاً» إلا بعد تدقيق فعلي. راجع صفحة منهجية المحتوى.",
  },
  {
    q: "هل التفسير أو الفقه فتوى؟",
    a: "لا. هما للتعلّم والفهم فقط، وليسا بديلاً عن سؤال أهل العلم في النوازل والأحكام الخاصة.",
  },
  {
    q: "هل يغني التجويد هنا عن المقرئ؟",
    a: "لا. الدروس تعين على الفهم النظري، أما الإتقان فبالتلقي والمشافهة من مقرئ مجاز.",
  },
  {
    q: "كيف أراجع حفظي؟",
    a: "من صفحة الحفظ تحدّد حالة كل آية (قيد الحفظ، محفوظ، تحتاج مراجعة، تمت مراجعتها) وتتابع تقدّمك. يُحفظ على جهازك، ويُحفظ أيضاً على الخادم إن سجّلت دخولك.",
  },
  {
    q: "وجدت خطأً في نص، ماذا أفعل؟",
    a: "راسلنا من صفحة التواصل مع ذكر الرابط ورقم الآية أو الحديث ووصف الخطأ، وسنراجعه على المصدر الأصلي.",
  },
  {
    q: "هل يعمل على الجوال؟",
    a: "نعم، الواجهة متجاوبة مع الشاشات الصغيرة، ويمكن إضافة الموقع إلى الشاشة الرئيسية.",
  },
  {
    q: "كيف أدعم المشروع؟",
    a: "من صفحة «ادعم رِفْق»، أو بمشاركة الموقع مع من ينتفع به.",
  },
  {
    q: "كيف أتواصل معكم؟",
    a: "من صفحة تواصل معنا، أو عبر البريد rifq.support.rifq@gmail.com",
  },
];

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-14">
        <PageHeader
          icon={<IconMessage size={22} />}
          kicker="مساعدة"
          title="الأسئلة الشائعة"
        />
        <p className="text-muted-foreground text-sm mb-10">
          إجابات سريعة حول استخدام المنصة.
        </p>
        <div className="space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-border bg-card px-5 py-4 open:shadow-sm"
            >
              <summary className="cursor-pointer font-medium list-none flex justify-between gap-2">
                {f.q}
                <span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                {f.a}
              </p>
            </details>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted-foreground">
          لم تجد إجابتك؟{" "}
          <Link href="/contact" className="text-primary hover:underline">
            تواصل معنا
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}