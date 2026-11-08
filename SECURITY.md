# أمان ونشر رِفْق

## متغيرات Vercel (إلزامي)

| المتغير | الوصف |
|---------|--------|
| `DATABASE_URL` | PostgreSQL (Neon) |
| `NEXTAUTH_SECRET` | ≥ 32 حرفاً — `openssl rand -base64 48` |
| `NEXT_PUBLIC_SITE_URL` | رابط الموقع النهائي (اختياري للـ sitemap) |

## البناء

البناء يشغّل `prisma generate` فقط — **لا** `db push --accept-data-loss`.

مزامنة الجداول مرة واحدة يدوياً أو من جهازك:

```bash
npx prisma db push
```

(بدون accept-data-loss إلا إن كنت واعياً بفقدان بيانات تجريبية)

## حماية الطلبات

- كل طلب مغيِّر (POST/PATCH/DELETE) يتحقق من تطابق `Origin` مع المضيف (حماية CSRF).
- حد محاولات لكل IP ولكل بريد في تسجيل الدخول.
- حجم جسم الطلب محدود (16KB) والمدخلات تُتحقق بـ Zod.

## الاختبارات

```bash
npm test
```

## ملاحظات

- لا ترفع ملف `.env` أبداً.
- حد المحاولات حالياً في الذاكرة (محدود على serverless) — يُفضّل Upstash لاحقاً.
- `/dashboard` محمي بـ middleware يتحقق من كوكي الجلسة.
