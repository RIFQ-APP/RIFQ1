# نشر رِفْق على Vercel

## الطريقة الأسهل (موصى بها)

### 1) ارفع المشروع على GitHub
```bash
cd rifq
git init
git add .
git commit -m "RIFQ initial"
# أنشئ مستودع فارغ على GitHub ثم:
git remote add origin https://github.com/YOUR_USER/rifq.git
git branch -M main
git push -u origin main
```

### 2) اربط Vercel
1. ادخل [vercel.com](https://vercel.com) وسجّل بحساب GitHub
2. **Add New Project** → اختر مستودع `rifq`
3. Framework: **Next.js** (يُكتشف تلقائياً)
4. قبل الضغط Deploy أضف متغيرات البيئة:

| Name | Value |
|------|--------|
| `DATABASE_URL` | رابط PostgreSQL (انظر الخطوة 3) |
| `NEXTAUTH_SECRET` | نص عشوائي طويل (مثال: `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (بعد أول نشر حدّثه) |

5. اضغط **Deploy**

### 3) قاعدة البيانات (مهم)
SQLite لا يعمل على Vercel (نظام الملفات مؤقت).

**خيار مجاني سريع — Neon:**
1. [neon.tech](https://neon.tech) → إنشاء مشروع
2. انسخ Connection string
3. في `prisma/schema.prisma` غيّر:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```
4. محلياً: `npx prisma db push`
5. ضع نفس `DATABASE_URL` في Vercel Environment Variables

**بديل:** Supabase (PostgreSQL مجاني) بنفس الطريقة.

### 4) بعد النشر
- المصحف والتلاوة والبحث والتجويد والأذكار تعمل بدون حساب
- التسجيل/الحفظ/المفضلة تحتاج `DATABASE_URL` مضبوطاً
- حدّث `NEXTAUTH_URL` إلى رابط موقعك النهائي

## النشر من الطرفية (Vercel CLI)

```bash
npm i -g vercel
cd rifq
vercel login
vercel
# للإنتاج:
vercel --prod
```

أضف المتغيرات من لوحة Vercel → Project → Settings → Environment Variables

## ماذا يعمل بدون قاعدة بيانات؟
- الصفحة الرئيسية
- المصحف (114 سورة)
- مشغل التلاوة
- الأذكار + العداد
- دروس التجويد
- السيرة
- البحث
- حفظ موضع القراءة في المتصفح (localStorage)

التسجيل والمفضلة وتتبع الحفظ السحابي يحتاجون PostgreSQL.
