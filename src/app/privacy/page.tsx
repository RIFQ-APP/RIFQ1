import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { IconScroll, IconShield, IconLock } from "@/components/icons";

export const metadata: Metadata = {
  title: "سياسة الخصوصية والأمان",
  description: "كيف تحمي رِفْق بياناتك وما نجمعه وما لا نفعله",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-3xl px-4 py-14">
        <PageHeader
          icon={<IconShield size={22} />}
          kicker="الخصوصية والأمان"
          title="سياسة الخصوصية"
          lead="نوضّح بصراحة ما يُجمع وكيف يُحمى، بلا تتبع إعلاني داخل صفحات التلاوة."
        />

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-foreground font-semibold text-base mb-2 flex items-center gap-2">
              <IconLock size={16} className="text-primary" />
              البيانات التي قد نجمعها
            </h2>
            <ul className="list-disc me-5 space-y-1">
              <li>بيانات الحساب عند التسجيل: الاسم (اختياري)، البريد، وكلمة المرور بعد التشفير.</li>
              <li>تقدّم القراءة والحفظ والمفضلة المرتبطة بحسابك إن سجّلت دخولاً.</li>
              <li>بيانات تقنية لازمة للتشغيل (مثل عنوان IP مختزل في سجلات الاستضافة للحماية من الإساءة).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">التخزين على جهازك</h2>
            <p>
              بعض التفضيلات (موضع القراءة، الورد، المرجعيات المحلية، خطة اليوم) قد تُحفظ عبر
              localStorage على متصفحك لتعمل بدون حساب. يمكنك مسحها من إعدادات المتصفح.
            </p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">كيف نحمي البيانات؟</h2>
            <ul className="list-disc me-5 space-y-1">
              <li>كلمات المرور تُخزَّن بعد تجزئة قوية (bcrypt) وليست كنص واضح.</li>
              <li>جلسة الدخول عبر كوكي HttpOnly ولا تُقرأ من سكربتات الصفحة.</li>
              <li>استخدام HTTPS على الاستضافة، ورؤوس أمان (مثل منع التضمين في إطارات غريبة).</li>
              <li>التحقق من المدخلات على الخادم، وحدّ لمحاولات تسجيل الدخول المتكررة.</li>
              <li>لا نطلب صلاحيات غير لازمة (كاميرا، موقع جغرافي، مدفوعات).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">ما لا نفعله</h2>
            <ul className="list-disc me-5 space-y-1">
              <li>لا نبيع بياناتك لأطراف أخرى.</li>
              <li>لا نضع شبكات إعلانات تتبّعية داخل صفحات المصحف والتعلّم.</li>
              <li>لا نشارك محتوى حسابك علناً.</li>
              <li>لا نطلب منك كلمة مرور حسابات أخرى.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">خدمات خارجية</h2>
            <p>
              لجلب نص القرآن والتلاوة قد يتصل المتصفح بواجهات عامة (مثل api.alquran.cloud).
              تخضع تلك الطلبات لسياسة تلك الخدمات. الاستضافة وقواعد البيانات تُدار عبر مزوّدين سحابيين
              بمعايير تشفير للنقل.
            </p>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">حقوقك</h2>
            <ul className="list-disc me-5 space-y-1">
              <li>طلب توضيح عن بيانات حسابك.</li>
              <li>طلب حذف الحساب عبر التواصل معنا.</li>
              <li>التوقف عن استخدام الخدمة ومسح التخزين المحلي من المتصفح.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground font-semibold text-base mb-2">التواصل</h2>
            <p>
              للاستفسار حول الخصوصية أو الأمان:{" "}
              <a className="text-primary font-medium" href="mailto:rifq.support.rifq@gmail.com">
                rifq.support.rifq@gmail.com
              </a>{" "}
              أو{" "}
              <Link href="/contact" className="text-primary hover:underline">
                صفحة التواصل
              </Link>
              .
            </p>
            <p className="text-xs pt-4">آخر تحديث: نوفمبر 2026</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
