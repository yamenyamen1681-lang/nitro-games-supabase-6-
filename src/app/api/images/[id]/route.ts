import { NextResponse } from "next/server";
import { db } from "@/db";
import { uploads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = Number(id);

    if (!numericId || Number.isNaN(numericId)) {
      return new NextResponse("Not found", { status: 404 });
    }

    const [row] = await db.select().from(uploads).where(eq(uploads.id, numericId));

    if (!row) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buffer = Buffer.from(row.data, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": row.mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Images API error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}
