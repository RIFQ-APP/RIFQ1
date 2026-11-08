"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthShell from "@/components/auth/AuthShell";
import { FormError, PasswordField, SubmitButton, TextField } from "@/components/auth/Fields";
import { checkPassword } from "@/lib/password-strength";

const BAR = ["bg-border", "bg-rose-500", "bg-amber-500", "bg-lime-500", "bg-emerald-600"];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const check = useMemo(() => checkPassword(password), [password]);
  const mismatch = confirm.length > 0 && confirm !== password;
  const canSubmit = check.length && check.letter && check.digit && !mismatch && confirm.length > 0 && email.length > 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !canSubmit) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "فشل إنشاء الحساب");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("تعذّر الاتصال. تحقق من الإنترنت وحاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const rule = (ok: boolean, text: string) => (
    <li className={`flex items-center gap-2 ${ok ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}`}>
      <span aria-hidden>{ok ? "✓" : "○"}</span>
      {text}
    </li>
  );

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <AuthShell
          title="أنشئ حسابك"
          subtitle="دقيقة واحدة وتبدأ رحلتك مع حفظ تقدّمك."
          footer={
            <>
              لديك حساب؟{" "}
              <Link href="/auth/login" className="font-medium text-primary hover:underline">
                تسجيل الدخول
              </Link>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <TextField
              label="الاسم (اختياري)"
              type="text"
              autoComplete="name"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="كيف نناديك؟"
            />
            <TextField
              label="البريد الإلكتروني"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              dir="ltr"
              style={{ textAlign: "right" }}
            />
            <div>
              <PasswordField
                label="كلمة المرور"
                required
                autoComplete="new-password"
                maxLength={128}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 أحرف على الأقل"
              />
              {password.length > 0 && (
                <div className="mt-3" aria-live="polite">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-soft ${check.score >= i ? BAR[check.score] : "bg-border"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">القوة: {check.label || "قصيرة جداً"}</p>
                </div>
              )}
              <ul className="mt-3 space-y-1 text-xs">
                {rule(check.length, "8 أحرف على الأقل")}
                {rule(check.letter, "تحتوي على حروف")}
                {rule(check.digit, "تحتوي على رقم")}
              </ul>
            </div>
            <PasswordField
              label="تأكيد كلمة المرور"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={mismatch ? "كلمتا المرور غير متطابقتين" : undefined}
            />
            <FormError message={error} />
            <SubmitButton loading={loading}>{loading ? "جاري الإنشاء…" : "إنشاء حساب"}</SubmitButton>
            <p className="text-center text-xs text-muted-foreground leading-relaxed">
              بإنشاء الحساب فأنت توافق على{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                سياسة الخصوصية
              </Link>
              .
            </p>
          </form>
        </AuthShell>
      </main>
      <Footer />
    </>
  );
}
