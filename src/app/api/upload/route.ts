import { NextResponse } from "next/server";
import { db } from "@/db";
import { uploads } from "@/db/schema";
import { ensureDbReady } from "@/db/schema";

// Vercel Serverless Functions cap request bodies at ~4.5MB — keep a safety
// margin below that so we can return a clear error instead of a platform 413.
const MAX_BYTES = 4 * 1024 * 1024; // 4MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "لم يتم إرفاق أي ملف" },
        { status: 400 }
      );
    }

    if (
      !file.type.startsWith("image/") &&
      !file.type.startsWith("video/") &&
      !file.type.startsWith("audio/")
    ) {
      return NextResponse.json(
        { success: false, message: "نوع الملف غير مدعوم — الرجاء رفع صورة أو فيديو أو صوت فقط" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          success: false,
          message: `حجم الملف كبير جداً (${(file.size / (1024 * 1024)).toFixed(
            1
          )}MB) — الحد الأقصى المسموح 4MB`,
        },
        { status: 400 }
      );
    }

    await ensureDbReady();

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    const [row] = await db
      .insert(uploads)
      .values({ mimeType: file.type, data: base64 })
      .returning({ id: uploads.id });

    return NextResponse.json({
      success: true,
      url: `/api/images/${row.id}`,
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { success: false, message: "تعذر رفع الملف — حاول مرة أخرى" },
      { status: 500 }
    );
  }
}
