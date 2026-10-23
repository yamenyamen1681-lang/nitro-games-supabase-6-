"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  MessageSquarePlus,
  ShieldCheck,
  Loader2,
  Quote,
  MapPin,
  CheckCircle2,
  AlertCircle,
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

const RATING_LABELS = ["", "سيء", "مقبول", "جيد", "ممتاز", "خرافي 🔥"];

const inputCls =
  "w-full rounded-xl border border-[#1d3563] bg-[#081226]/90 px-3.5 py-3 text-sm text-white placeholder-gray-500 transition-all focus:border-[#00e5ff] focus:bg-[#0a1630] focus:shadow-[0_0_0_3px_rgba(0,229,255,0.12),0_0_18px_rgba(0,163,255,0.25)] focus:outline-none";

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
            itemBought: r.itemBought || "منتج من المتجر",
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-GB") : "",
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

  const stats = useMemo(() => {
    if (reviewsList.length === 0) return { avg: 0, count: 0 };
    const sum = reviewsList.reduce((a, r) => a + r.rating, 0);
    return { avg: sum / reviewsList.length, count: reviewsList.length };
  }, [reviewsList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (!author.trim() || !city.trim() || !comment.trim()) {
      setErrorMsg("يرجى تعبئة الاسم والمدينة والتقييم قبل الإرسال");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim(),
          city: city.trim(),
          comment: comment.trim(),
          rating,
          itemBought: itemBought.trim() || "منتج من المتجر",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to submit review");
      }

      setSuccessMsg("شكراً لتقييمك! تم نشر رأيك للجميع 🎉");

      setAuthor("");
      setCity("");
      setComment("");
      setItemBought("");
      setRating(5);
      setHoverRating(0);

      await loadReviews();
    } catch (error) {
      console.warn("Review submit error:", error);
      setErrorMsg("تعذر إرسال التقييم الآن — حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  const shownRating = hoverRating || rating;

  return (
    <section id="reviews" className="relative py-16 sm:py-24">
      <style>{`
        @keyframes rvSheen { 0%, 55% { left: -60%; } 100% { left: 130%; } }
        .rv-sheen { position: relative; overflow: hidden; }
        .rv-sheen::after {
          content: ""; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent);
          transform: skewX(-20deg); animation: rvSheen 3.6s ease-in-out infinite;
        }
        .rv-scroll { scrollbar-width: thin; scrollbar-color: #00a3ff55 transparent; }
        .rv-scroll::-webkit-scrollbar { width: 5px; }
        .rv-scroll::-webkit-scrollbar-thumb { background: #00a3ff55; border-radius: 9999px; }
        @media (prefers-reduced-motion: reduce) { .rv-sheen::after { animation: none; } }
      `}</style>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00a3ff]/60 to-transparent" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-56"
        style={{ background: "radial-gradient(ellipse 55% 100% at 50% 0%, rgba(0,163,255,0.13), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* العنوان + الملخص */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00a3ff]/35 bg-[#00a3ff]/10 px-4 py-1.5">
            <Quote className="h-3.5 w-3.5 text-[#00e5ff]" />
            <span className="font-['Cairo'] text-[11px] font-bold tracking-wide text-[#00e5ff]">
              آراء عملائنا
            </span>
          </div>

          <h2 className="font-['Cairo'] text-3xl font-black leading-snug text-white sm:text-5xl">
            شو{" "}
            <span className="bg-gradient-to-r from-[#00a3ff] via-[#00e5ff] to-[#9fe9ff] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(0,229,255,0.4)]">
              قالوا عنا؟
            </span>
          </h2>

          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-[3px] w-3 rounded-full bg-[#00a3ff]/40" />
            <span className="h-[3px] w-16 rounded-full bg-gradient-to-r from-[#00e5ff] to-[#0047ff] shadow-[0_0_10px_#00e5ff]" />
            <span className="h-[3px] w-3 rounded-full bg-[#00a3ff]/40" />
          </div>

          <p className="mt-4 text-xs text-gray-400 sm:text-sm">
            تقييمات حقيقية من عملاء NITRO GAMES بفلسطين
          </p>

          {stats.count > 0 && (
            <div className="mx-auto mt-6 inline-flex items-center gap-4 rounded-2xl border border-[#16294a] bg-gradient-to-b from-[#0a1630]/90 to-[#050b19]/90 px-5 py-3 shadow-[0_0_28px_rgba(0,163,255,0.18)]">
              <span className="font-tech text-4xl font-black text-white drop-shadow-[0_0_14px_rgba(0,229,255,0.5)]">
                {stats.avg.toFixed(1)}
              </span>
              <div className="flex flex-col items-start gap-1">
                <div className="flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(stats.avg)
                          ? "fill-[#00e5ff] text-[#00e5ff] drop-shadow-[0_0_6px_#00e5ff]"
                          : "text-[#1d3563]"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-['Cairo'] text-[11px] text-gray-400">
                  من <span className="font-bold text-[#00e5ff]">{stats.count}</span> تقييم
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* قائمة التقييمات */}
          <div className="rv-scroll max-h-[620px] space-y-4 overflow-y-auto pl-1 lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-16 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin text-[#00e5ff]" />
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
                  className="group rounded-3xl bg-gradient-to-b from-[#00a3ff]/40 via-[#13213d] to-[#0a1630] p-[1px] transition-all duration-500 hover:from-[#00e5ff] hover:via-[#00a3ff]/40 hover:to-[#0047ff]/50 hover:shadow-[0_0_26px_rgba(0,163,255,0.3)]"
                >
                  <div className="relative overflow-hidden rounded-[23px] bg-gradient-to-b from-[#0a1630] via-[#071125] to-[#050b19] p-5 text-right">
                    <Quote className="pointer-events-none absolute -left-1 -top-1 h-20 w-20 rotate-180 text-[#00a3ff]/[0.07]" />

                    {/* الرأس */}
                    <div className="relative mb-3 flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#0047ff] p-[2px] shadow-[0_0_16px_rgba(0,229,255,0.45)]">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#050c1e] font-['Cairo'] text-lg font-black text-[#00e5ff]">
                            {r.author.trim().charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-['Cairo'] text-sm font-black text-white">{r.author}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-gray-400">
                            <MapPin className="h-3 w-3 text-[#00a3ff]" />
                            {r.city}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-0.5 rounded-xl border border-[#16294a] bg-[#08122a]/80 px-2 py-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.rating
                                ? "fill-[#00e5ff] text-[#00e5ff] drop-shadow-[0_0_5px_#00e5ff]"
                                : "text-[#1d3563]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="relative mb-4 text-sm leading-relaxed text-gray-200">{r.comment}</p>

                    <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-[#16294a] pt-3">
                      <span className="font-mono text-[11px] text-gray-500">{r.date}</span>

                      {r.verifiedPurchase && (
                        <span className="flex items-center gap-1.5 rounded-full border border-[#00e5ff]/35 bg-[#00e5ff]/10 px-2.5 py-1 font-['Cairo'] text-[11px] font-bold text-[#00e5ff]">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {r.itemBought}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* نموذج التقييم */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-gradient-to-b from-[#00e5ff]/70 via-[#00a3ff]/30 to-[#0a1630] p-[1.5px] shadow-[0_0_34px_rgba(0,163,255,0.22)] lg:sticky lg:top-24">
              <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-b from-[#0a1630] via-[#071125] to-[#050b19] p-6">
                <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />

                <h3 className="mb-1 flex items-center gap-2.5 font-['Cairo'] text-lg font-black text-white">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#00e5ff]/40 bg-[#00e5ff]/10 shadow-[0_0_14px_rgba(0,229,255,0.3)]">
                    <MessageSquarePlus className="h-4.5 w-4.5 text-[#00e5ff]" />
                  </span>
                  شاركنا تقييمك
                </h3>
                <p className="mb-5 text-[11px] text-gray-400">رأيك بيساعد غيرك يختار صح</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      placeholder="اسمك"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      placeholder="مدينتك"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="المنتج اللي اشتريته (اختياري)"
                    value={itemBought}
                    onChange={(e) => setItemBought(e.target.value)}
                    className={inputCls}
                  />

                  {/* التقييم بالنجوم */}
                  <div className="rounded-2xl border border-[#16294a] bg-[#060e1f]/80 py-3">
                    <div className="flex items-center justify-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const val = i + 1;
                        const active = val <= shownRating;
                        return (
                          <button
                            type="button"
                            key={i}
                            onMouseEnter={() => setHoverRating(val)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(val)}
                            className="cursor-pointer p-0.5 transition-transform hover:scale-125 active:scale-95"
                            aria-label={`${val} نجوم`}
                          >
                            <Star
                              className={`h-7 w-7 transition-all ${
                                active
                                  ? "fill-[#00e5ff] text-[#00e5ff] drop-shadow-[0_0_8px_#00e5ff]"
                                  : "text-[#1d3563]"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-1.5 text-center font-['Cairo'] text-xs font-bold text-[#00e5ff]">
                      {RATING_LABELS[shownRating]}
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="اكتب تقييمك..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className={`${inputCls} resize-none`}
                  />

                  {errorMsg && (
                    <p className="flex items-center gap-2 rounded-xl border border-[#00a3ff]/40 bg-[#00a3ff]/10 px-3 py-2 text-[11px] font-bold text-[#9fe9ff]">
                      <AlertCircle className="h-4 w-4 shrink-0 text-[#00e5ff]" />
                      {errorMsg}
                    </p>
                  )}

                  {successMsg && (
                    <p className="flex items-center gap-2 rounded-xl border border-[#00e5ff]/40 bg-[#00e5ff]/10 px-3 py-2 text-[11px] font-bold text-[#00e5ff]">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      {successMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rv-sheen flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] py-3.5 font-['Cairo'] text-sm font-black text-[#02121f] shadow-[0_0_22px_rgba(0,163,255,0.5)] transition-all hover:shadow-[0_0_34px_rgba(0,229,255,0.85)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MessageSquarePlus className="h-4 w-4" />
                    )}
                    <span>{submitting ? "جارٍ الإرسال..." : "إرسال التقييم"}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
