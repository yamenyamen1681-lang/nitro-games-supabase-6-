import { NextResponse } from "next/server";
import { db } from "@/db";
import { ensureDbReady, reviews } from "@/db/schema";
import { INITIAL_REVIEWS } from "@/lib/data";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    await ensureDbReady();

    let dbReviews = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.createdAt));

    // إضافة التقييمات الافتراضية مرة واحدة إذا الجدول فارغ
    if (dbReviews.length === 0) {
      try {
        for (const rev of INITIAL_REVIEWS) {
          await db.insert(reviews).values({
            author: rev.author,
            city: rev.city,
            rating: rev.rating,
            comment: rev.comment,
            verifiedPurchase: rev.verifiedPurchase,
            itemBought: rev.itemBought,
          });
        }

        dbReviews = await db
          .select()
          .from(reviews)
          .orderBy(desc(reviews.createdAt));
      } catch (e) {
        console.warn("Reviews seed warning:", e);
      }
    }

    const formatted =
      dbReviews.length > 0
        ? dbReviews.map((r) => ({
            id: r.id,
            author: r.author,
            city: r.city,
            rating: r.rating,
            comment: r.comment,
            verifiedPurchase: r.verifiedPurchase,
            itemBought: r.itemBought || "منتج من المتجر",
            date: r.createdAt
              ? new Date(r.createdAt).toLocaleDateString("ar-EG")
              : "مؤخرًا",
          }))
        : INITIAL_REVIEWS;

    return NextResponse.json({
      success: true,
      reviews: formatted,
    });
  } catch (error) {
    console.error("Reviews GET error:", error);

    return NextResponse.json(
      {
        success: false,
        reviews: [],
        message: "تعذر تحميل التقييمات",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureDbReady();

    const body = await request.json();

    const author = String(body.author || "").trim();
    const city = String(body.city || "").trim();
    const comment = String(body.comment || "").trim();
    const itemBought = String(body.itemBought || "").trim();
    const rating = Math.min(
      5,
      Math.max(1, Number(body.rating) || 5)
    );

    if (!author || !city || !comment) {
      return NextResponse.json(
        {
          success: false,
          message: "يرجى تعبئة الاسم والمدينة والتعليق",
        },
        { status: 400 }
      );
    }

    const [newReview] = await db
      .insert(reviews)
      .values({
        author,
        city,
        rating,
        comment,
        verifiedPurchase: true,
        itemBought: itemBought || "منتج من المتجر",
      })
      .returning();

    return NextResponse.json({
      success: true,
      review: newReview,
      message: "شكراً لتقييمك! تم نشر رأيك للجميع 🎉",
    });
  } catch (error) {
    console.error("Reviews POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "تعذر حفظ التقييم حالياً",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureDbReady();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "معرّف التعليق مطلوب",
        },
        { status: 400 }
      );
    }

    const reviewId = Number(id);

    if (!Number.isInteger(reviewId)) {
      return NextResponse.json(
        {
          success: false,
          message: "معرّف التعليق غير صحيح",
        },
        { status: 400 }
      );
    }

    const deleted = await db
      .delete(reviews)
      .where(eq(reviews.id, reviewId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "التعليق غير موجود",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف التعليق بنجاح",
      deletedId: reviewId,
    });
  } catch (error) {
    console.error("Reviews DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "تعذر حذف التعليق",
      },
      { status: 500 }
    );
  }
}
