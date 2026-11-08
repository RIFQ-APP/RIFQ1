"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { IconMessage } from "@/components/icons";
import PageHeader from "@/components/PageHeader";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`رسالة من رِفْق - ${name || "زائر"}`);
    const body = encodeURIComponent(
      `الاسم: ${name}\nالبريد: ${email}\n\n${message}`
    );
    // افتح البريد الافتراضي — عدّل العنوان لاحقاً
    window.location.href = `mailto:rifq.support.rifq@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-lg px-4 py-14">
        <PageHeader
          icon={<IconMessage size={22} />}
          kicker="رسالة"
          title="تواصل معنا"
        />
        <p className="text-muted-foreground text-sm mb-2">
          اقتراحاتك وملاحظاتك تساعدنا على تحسين رِفْق.
        </p>
        <p className="text-sm mb-8">
          البريد:{" "}
          <a
            href="mailto:rifq.support.rifq@gmail.com"
            className="text-primary font-medium hover:underline"
            dir="ltr"
          >
            rifq.support.rifq@gmail.com
          </a>
        </p>

        {sent ? (
          <div className="rounded-2xl border border-border bg-secondary/50 p-6 text-sm">
            تم تجهيز رسالة البريد. إن لم يُفتح تطبيق البريد، راسلنا يدوياً أو عد من{" "}
            <Link href="/" className="text-primary underline">
              الرئيسية
            </Link>
            .
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">الاسم</label>
              <input
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسمك"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">البريد (اختياري)</label>
              <input
                type="email"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الرسالة</label>
              <textarea
                required
                rows={5}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب ملاحظتك أو اقتراحك..."
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-medium"
            >
              إرسال
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}