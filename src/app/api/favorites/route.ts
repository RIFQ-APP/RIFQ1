import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { forbiddenOrigin, isSameOrigin, readJsonLimited } from "@/lib/security";

const schema = z.object({
  type: z.enum(["ayah", "hadith", "dhikr", "lesson"]),
  surahNumber: z.number().int().min(1).max(114).optional(),
  ayahNumber: z.number().int().min(1).max(286).optional(),
  contentId: z.string().max(100).optional(),
  title: z.string().max(200).optional(),
});

export async function GET() {
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ favorites: [] }, { status: 401 });
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ favorites });
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

    const fav = await prisma.favorite.create({
      data: {
        userId: user.id,
        type: parsed.data.type,
        surahNumber: parsed.data.surahNumber,
        ayahNumber: parsed.data.ayahNumber,
        contentId: parsed.data.contentId,
        title: parsed.data.title,
      },
    });

    return NextResponse.json({ favorite: fav });
  } catch (err: unknown) {
    if ((err as { code?: string })?.code === "P2002") {
      return NextResponse.json({ error: "موجود بالفعل في المفضلة" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isSameOrigin(req)) return forbiddenOrigin();
  const user = await getSession();
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id || id.length > 64) {
    return NextResponse.json({ error: "معرف مطلوب" }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ ok: true });
}
