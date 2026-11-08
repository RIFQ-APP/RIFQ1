"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthShell from "@/components/auth/AuthShell";
import { FormError, PasswordField, SubmitButton, TextField } from "@/components/auth/Fields";
import { safeNext } from "@/lib/password-strength";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "فشل تسجيل الدخول");
        return;
      }
      const next = safeNext(new URLSearchParams(window.location.search).get("next"));
      router.push(next);
      router.refresh();
    } catch {
      setError("تعذّر الاتصال. تحقق من الإنترنت وحاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <AuthShell
          title="مرحباً بعودتك"
          subtitle="سجّل الدخول لمتابعة حفظك وتقدّمك."
          footer={
            <>
              ليس لديك حساب؟{" "}
              <Link href="/auth/register" className="font-medium text-primary hover:underline">
                إنشاء حساب
              </Link>
            </>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
            <PasswordField
              label="كلمة المرور"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <FormError message={error} />
            <SubmitButton loading={loading}>{loading ? "جاري الدخول…" : "دخول"}</SubmitButton>
          </form>
        </AuthShell>
      </main>
      <Footer />
    </>
  );
}
