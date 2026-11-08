import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { IconScroll, IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "منهجية المحتوى",
  description: "كيف نختار النصوص والمصادر في رِفْق",
};

export default function MethodologyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-14">
        <PageHeader
          icon={<IconScroll size={22} />}
          kicker="التوثيق"
          title="منهجية المحتوى"
          lead="الموثوقية قبل كثرة المحتوى. نوضّح هنا مصادر النصوص وحدود المنصة."
        />
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-foreground font-semibold mb-2">حالات المراجعة</h2>
            <ul className="space-y-1">
              <li>• <strong className="text-foreground">مراجَع</strong>: راجعه مختص وطابق مصدره.</li>
              <li>• <strong className="text-foreground">قيد المراجعة</strong>: منقول من مصدر معلوم ولم تكتمل مراجعته. هذه هي الحالة الافتراضية.</li>
              <li>• <strong className="text-foreground">مسودة</strong>: غير جاهز للاعتماد.</li>
            </ul>
            <p className="mt-2">لا تُعلَّم أي مادة «مراجَعة» تلقائياً أو بحكم الكثرة؛ يلزمها تعيين صريح بعد التدقيق.</p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold mb-2">القرآن الكريم</h2>
            <p>
              نص المصحف يُجلب من واجهات رقمية شائعة (مثل api.alquran.cloud) برواية حفص عن عاصم
              قدر الإمكان. لا نُعدّل ألفاظ الآيات، ولا نولّد قرآناً بالذكاء الاصطناعي.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold mb-2">التفسير</h2>
            <p>
              يُعرض من طبعات/واجهات معلنة الاسم (الميسر، الجلالين، السعدي…). التفسير للفهم،
              وليس بديلاً عن سؤال أهل العلم في النوازل.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold mb-2">الحديث والأذكار</h2>
            <p>
              الأحاديث في مكتبة الحديث تُجلب من قاعدة بيانات مفتوحة للكتب المشهورة (hadith-api)
              مع ذكر الكتاب والرقم والدرجة ومصدرها حيث تتوفر. والمختارات التعليمية تُذكر مع العزو قدر المستطاع. بعض العناصر تحتاج مراجعة تخريج
              أدق؛ نُفضّل تقليل العدد على نشر نص بلا مصدر. إن وجدت خطأً راسلنا.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold mb-2">الفقه والتجويد والسيرة</h2>
            <p>
              مختصرات تعليمية من مراجع مشهورة، وليست مذهباً ملزماً ولا إجازة تجويد.
              التجويد النظري لا يغني عن التلقي.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold mb-2">كيف تُصحَّح الأخطاء</h2>
            <p>
              يُراجَع كل بلاغ على المصدر الأصلي، ثم يُصحَّح النص أو تُحدَّث حالته. لا نحذف الملاحظات
              ولا نعدّل نصاً شرعياً اعتماداً على الذاكرة وحدها.
            </p>
          </section>
          <section>
            <h2 className="text-foreground font-semibold mb-2 flex items-center gap-2">
              <IconShield size={16} className="text-primary" />
              أبلغ عن خطأ
            </h2>
            <p>
              البريد:{" "}
              <a className="text-primary font-medium" href="mailto:rifq.support.rifq@gmail.com">
                rifq.support.rifq@gmail.com
              </a>{" "}
              أو{" "}
              <Link href="/contact" className="text-primary hover:underline">
                صفحة التواصل
              </Link>
              . اذكر الرابط ورقم الآية/الحديث ووصف الخطأ.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
