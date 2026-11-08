export interface PasswordCheck {
  length: boolean;
  letter: boolean;
  digit: boolean;
  long: boolean;
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
}

/** تقدير بسيط لقوة كلمة المرور للواجهة فقط؛ التحقق الفعلي على الخادم (passwordIssues) */
export function checkPassword(pw: string): PasswordCheck {
  const length = pw.length >= 8;
  const letter = /[A-Za-z\u0600-\u06FF]/.test(pw);
  const digit = /[0-9]/.test(pw);
  const long = pw.length >= 12;
  const mixed = /[a-z\u0600-\u06FF]/.test(pw) && /[A-Z]/.test(pw);
  const symbol = /[^A-Za-z0-9\u0600-\u06FF\s]/.test(pw);
  let score = 0;
  if (length && letter && digit) score = 2;
  else if (pw.length >= 4) score = 1;
  if (score === 2 && (long || mixed || symbol)) score = 3;
  if (score === 3 && long && (mixed || symbol)) score = 4;
  const labels = ["", "ضعيفة", "مقبولة", "جيدة", "قوية"];
  return { length, letter, digit, long, score: score as PasswordCheck["score"], label: labels[score] };
}

/** مسار تحويل آمن بعد الدخول: داخلي فقط */
export function safeNext(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
