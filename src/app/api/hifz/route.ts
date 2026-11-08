import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { forbiddenOrigin, isSameOrigin, readJsonLimited } from "@/lib/security";

const schema = z.object({
  surahNumber: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1).max(286),
  status: z.enum([
    "not_started",
    "learning",
    "memorized",
    "needs_review",
    "reviewed",
  ]),
});

export async function GET(req: NextRequest) {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ progress: [] }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const surah = searchParams.get("surah");

  const where: { userId: string; surahNumber?: number } = { userId: user.id };
  if (surah) {
    const n = parseInt(surah, 10);
    if (!Number.isInteger(n) || n < 1 || n > 114) {
      return NextResponse.json({ error: "رقم السورة غير صالح" }, { status: 400 });
    }
    where.surahNumber = n;
  }

  const progress = await prisma.hifzProgress.findMany({
    where,
    orderBy: [{ surahNumber: "asc" }, { ayahNumber: "asc" }],
  });

  return NextResponse.json({ progress });
}

export async function POST(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  try {
    const body = await readJsonLimited(req);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
    }

    const item = await prisma.hifzProgress.upsert({
      where: {
        userId_surahNumber_ayahNumber: {
          userId: user.id,
          surahNumber: parsed.data.surahNumber,
          ayahNumber: parsed.data.ayahNumber,
        },
      },
      create: {
        userId: user.id,
        surahNumber: parsed.data.surahNumber,
        ayahNumber: parsed.data.ayahNumber,
        status: parsed.data.status,
      },
      update: { status: parsed.data.status },
    });

    return NextResponse.json({ item });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
