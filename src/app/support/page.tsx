import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { IconHeart, IconMessage, IconShare2 } from "@/components/icons";

export const metadata: Metadata = {
  title: "ادعم رِفْق",
  description: "ساهم في استمرار منصة رِفْق وتطويرها لخدمة القرآن والعلوم الإسلامية",
};

export default function SupportPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center">
          <PageHeader
            icon={<IconHeart size={22} />}
            kicker="المساهمة"
            title="ادعم رِفْق"
            lead="رِفْق منصة تعليمية مجانية تهدف لتيسير قراءة القرآن وحفظه وفهمه. دعمك يساعد على استمرار التطوير وتحسين التجربة."
          />

          <div className="grid gap-4 sm:grid-cols-3 text-start mb-12 mt-8">
            {[
              {
                t: "محتوى موثوق",
                d: "الاعتماد على مصادر معروفة وفصل الأصل عن الشرح.",
              },
              {
                t: "تجربة هادئة",
                d: "واجهة بسيطة تشجّع على الاستمرار دون تشتيت.",
              },
              {
                t: "تطوير مستمر",
                d: "خطط حفظ، مراجعة، تجويد، وبحث يتطور مع الوقت.",
              },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <h3 className="font-semibold text-foreground mb-2">{x.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{x.d}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-secondary/40 p-8 mb-10 text-start">
            <h2 className="text-lg font-semibold mb-4 text-center">كيف تدعم المنصة؟</h2>
            <ul className="text-sm text-foreground space-y-4 max-w-md mx-auto">
              <li className="flex gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconShare2 size={18} />
                </span>
                <span>
                  <strong className="block mb-0.5">المشاركة</strong>
                  <span className="text-muted-foreground">
                    انشر رابط الموقع لمن ينتفع بالقراءة والحفظ والتعلّم.
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconMessage size={18} />
                </span>
                <span>
                  <strong className="block mb-0.5">الاقتراح والملاحظة</strong>
                  <span className="text-muted-foreground">
                    راسلنا عبر صفحة التواصل أو البريد rifq.support.rifq@gmail.com
                  </span>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconHeart size={18} />
                </span>
                <span>
                  <strong className="block mb-0.5">الدعاء والاستمرار</strong>
                  <span className="text-muted-foreground">
                    استخدم المنصة برفق، وادعُ أن ينفع الله بها.
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
            >
              <IconMessage size={16} />
              تواصل معنا
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium"
            >
              العودة للرئيسية
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
