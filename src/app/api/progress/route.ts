import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { forbiddenOrigin, isSameOrigin, readJsonLimited } from "@/lib/security";

const schema = z.object({
  surahNumber: z.number().int().min(1).max(114),
  ayahNumber: z.number().int().min(1).max(286),
});

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ progress: null }, { status: 401 });
  }

  const progress = await prisma.lastReading.findUnique({
    where: { userId: user.id },
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

    const progress = await prisma.lastReading.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        surahNumber: parsed.data.surahNumber,
        ayahNumber: parsed.data.ayahNumber,
      },
      update: {
        surahNumber: parsed.data.surahNumber,
        ayahNumber: parsed.data.ayahNumber,
      },
    });

    return NextResponse.json({ progress });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
