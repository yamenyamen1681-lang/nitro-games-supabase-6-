"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  MessageSquarePlus,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface ReviewItem {
  id: string | number;
  author: string;
  city: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  itemBought?: string;
  date: string;
}

interface ApiReview {
  id: number;
  author: string;
  city: string;
  comment: string;
  verifiedPurchase?: boolean;
  createdAt: string;
  rating?: number;
  itemBought?: string;
}

export const CustomerReviews: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [itemBought, setItemBought] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/reviews", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load reviews");
      }

      const data: ApiReview[] = await response.json();

      const formatted: ReviewItem[] = Array.isArray(data)
        ? data.map((r) => ({
            id: r.id,
            author: r.author,
            city: r.city || "فلسطين",
            rating: Math.min(5, Math.max(1, r.rating || 5)),
            comment: r.comment,
            verifiedPurchase: r.verifiedPurchase ?? true,
            itemBought:
              r.itemBought || "منتج من المتجر",
            date: r.createdAt
              ? new Date(r.createdAt).toLocaleDateString("ar-PS")
              : "",
          }))
        : [];

      setReviewsList(formatted);
    } catch (error) {
      console.warn("Failed to load reviews:", error);
      setErrorMsg("تعذر تحميل التقييمات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (
      !author.trim() ||
      !city.trim() ||
      !comment.trim()
    ) {
      setErrorMsg(
        "يرجى تعبئة الاسم والمدينة والتقييم قبل الإرسال"
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: author.trim(),
          city: city.trim(),
          comment: comment.trim(),
          rating,
          itemBought:
            itemBought.trim() || "منتج من المتجر",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to submit review"
        );
      }

      setSuccessMsg(
        "شكراً لتقييمك! تم نشر رأيك للجميع 🎉"
      );

      setAuthor("");
      setCity("");
      setComment("");
      setItemBought("");
      setRating(5);
      setHoverRating(0);

      await loadReviews();
    } catch (error) {
      console.warn("Review submit error:", error);

      setErrorMsg(
        "تعذر إرسال التقييم الآن — حاول مرة أخرى"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="reviews"
      className="relative border-t border-[#16223a] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <div className="mb-3 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gray-400">
            <span className="h-px w-10 bg-gradient-to-l from-[#00a3ff]/50 to-transparent" />

            آراء عملائنا

            <span className="h-px w-10 bg-gradient-to-r from-[#00e5ff]/50 to-transparent" />
          </div>

          <h2 className="font-['Cairo'] text-2xl font-black text-white sm:text-3xl">
            شو قالوا عنا؟
          </h2>

          <p className="mt-2 text-xs text-gray-400 sm:text-sm">
            تقييمات حقيقية من عملاء NITRO GAMES بفلسطين
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Reviews list */}
          <div className="max-h-[560px] space-y-4 overflow-y-auto pr-1 lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري تحميل التقييمات...
              </div>
            ) : reviewsList.length === 0 ? (
              <p className="py-16 text-center text-sm text-gray-400">
                لا توجد تقييمات بعد — كن أول من يقيّم! ⭐
              </p>
            ) : (
              reviewsList.map((r) => (
                <div
                  key={r.id}
                  className="panel rounded-2xl p-5 text-right"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-600"
                            }`}
                          />
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {r.author}
                      </span>

                      <span className="text-[10px] text-gray-500">
                        {r.city}
                      </span>
                    </div>
                  </div>

                  <p className="mb-3 text-xs leading-relaxed text-gray-300 sm:text-sm">
                    {r.comment}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">
                      {r.date}
                    </span>

                    {r.verifiedPurchase && (
                      <span className="flex items-center gap-1 rounded-full border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-2 py-0.5 text-[10px] text-[#00e5ff]">
                        <ShieldCheck className="h-3 w-3" />
                        {r.itemBought}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Submit form */}
          <div className="lg:col-span-2">
            <div className="panel rounded-2xl p-6 lg:sticky lg:top-24">
              <h3 className="mb-4 flex items-center gap-2 font-['Cairo'] text-sm font-black text-white">
                <MessageSquarePlus className="h-4 w-4 text-[#00a3ff]" />
                شاركنا تقييمك
              </h3>

              <form
                onSubmit={handleSubmit}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="اسمك"
                    value={author}
                    onChange={(e) =>
                      setAuthor(e.target.value)
                    }
                    className="rounded-xl border border-[#27405f] bg-[#16223a] px-3 py-2.5 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                  />

                  <input
                    type="text"
                    placeholder="مدينتك"
                    value={city}
                    onChange={(e) =>
                      setCity(e.target.value)
                    }
                    className="rounded-xl border border-[#27405f] bg-[#16223a] px-3 py-2.5 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  placeholder="المنتج اللي اشتريته (اختياري)"
                  value={itemBought}
                  onChange={(e) =>
                    setItemBought(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#27405f] bg-[#16223a] px-3 py-2.5 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                />

                {/* Rating */}
                <div className="flex items-center justify-center gap-1.5 py-1">
                  {Array.from({ length: 5 }).map(
                    (_, i) => {
                      const val = i + 1;
                      const active =
                        val <= (hoverRating || rating);

                      return (
                        <button
                          type="button"
                          key={i}
                          onMouseEnter={() =>
                            setHoverRating(val)
                          }
                          onMouseLeave={() =>
                            setHoverRating(0)
                          }
                          onClick={() =>
                            setRating(val)
                          }
                          className="cursor-pointer p-0.5"
                          aria-label={`${val} نجوم`}
                        >
                          <Star
                            className={`h-6 w-6 transition-colors ${
                              active
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-600"
                            }`}
                          />
                        </button>
                      );
                    }
                  )}
                </div>

                <textarea
                  rows={3}
                  placeholder="اكتب تقييمك..."
                  value={comment}
                  onChange={(e) =>
                    setComment(e.target.value)
                  }
                  className="w-full rounded-xl border border-[#27405f] bg-[#16223a] p-3 text-xs text-white focus:border-[#00a3ff] focus:outline-none"
                />

                {errorMsg && (
                  <p className="text-[11px] text-rose-400">
                    {errorMsg}
                  </p>
                )}

                {successMsg && (
                  <p className="text-[11px] text-green-400">
                    {successMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-cyber-cyan flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-xs font-black text-black disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquarePlus className="h-4 w-4" />
                  )}

                  <span>
                    {submitting
                      ? "جارٍ الإرسال..."
                      : "إرسال التقييم"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
