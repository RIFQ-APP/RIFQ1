import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { forbiddenOrigin, isSameOrigin, readJsonLimited } from "@/lib/security";

const createSchema = z.object({
  surahNumber: z.number().int().min(1).max(114).optional(),
  ayahNumber: z.number().int().min(1).max(286).optional(),
  content: z.string().trim().min(1).max(2000),
});

const updateSchema = z.object({
  id: z.string().min(1).max(64),
  content: z.string().trim().min(1).max(2000),
});

const MAX_NOTES_PER_USER = 1000;

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ notes: [] }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const where: { userId: string; surahNumber?: number } = { userId: user.id };
  const surah = searchParams.get("surah");
  if (surah) {
    const n = parseInt(surah, 10);
    if (!Number.isInteger(n) || n < 1 || n > 114) {
      return NextResponse.json({ error: "رقم السورة غير صالح" }, { status: 400 });
    }
    where.surahNumber = n;
  }

  const notes = await prisma.note.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ notes });
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const parsed = createSchema.safeParse(await readJsonLimited(req));
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }
  try {
    const count = await prisma.note.count({ where: { userId: user.id } });
    if (count >= MAX_NOTES_PER_USER) {
      return NextResponse.json({ error: "بلغت الحد الأقصى للملاحظات" }, { status: 409 });
    }
    const note = await prisma.note.create({
      data: { userId: user.id, ...parsed.data },
    });
    return NextResponse.json({ note });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const parsed = updateSchema.safeParse(await readJsonLimited(req));
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }
  // updateMany مع userId يضمن عدم تعديل ملاحظات الآخرين
  const res = await prisma.note.updateMany({
    where: { id: parsed.data.id, userId: user.id },
    data: { content: parsed.data.content },
  });
  if (res.count === 0) {
    return NextResponse.json({ error: "الملاحظة غير موجودة" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id || id.length > 64) {
    return NextResponse.json({ error: "معرف مطلوب" }, { status: 400 });
  }
  await prisma.note.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ ok: true });
}
