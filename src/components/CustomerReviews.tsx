"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquarePlus, ShieldCheck, Loader2 } from "lucide-react";

interface ReviewItem {
  id: number;
  author: string;
  city: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  itemBought: string;
  date: string;
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
      const res = await fetch("/api/reviews", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setReviewsList(data.reviews || []);
    } catch (e) {
      console.warn("Failed to load reviews:", e);
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

    if (!author.trim() || !city.trim() || !comment.trim()) {
      setErrorMsg("يرجى تعبئة الاسم والمدينة والتقييم قبل الإرسال");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim(),
          city: city.trim(),
          rating,
          comment: comment.trim(),
          itemBought: itemBought.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "failed");

      setSuccessMsg(data.message || "شكراً لتقييمك! تم نشر رأيك 🎉");
      setAuthor("");
      setCity("");
      setComment("");
      setItemBought("");
      setRating(5);
      loadReviews();
    } catch (err) {
      console.warn("Review submit error:", err);
      setErrorMsg("تعذر إرسال التقييم الآن — حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="relative py-16 sm:py-20 border-t border-[#16223a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-[11px] font-tech text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-gradient-to-l from-[#00a3ff]/50 to-transparent" />
            آراء عملائنا
            <span className="w-10 h-px bg-gradient-to-r from-[#00e5ff]/50 to-transparent" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cairo']">شو قالوا عنا؟</h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            تقييمات حقيقية من عملاء NITRO GAMES بفلسطين
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-3 space-y-4 max-h-[560px] overflow-y-auto pr-1">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                جاري تحميل التقييمات...
              </div>
            ) : reviewsList.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-16">
                لا توجد تقييمات بعد — كن أول من يقيّم! ⭐
              </p>
            ) : (
              reviewsList.map((r) => (
                <div key={r.id} className="panel rounded-2xl p-5 text-right">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{r.author}</span>
                      <span className="text-[10px] text-gray-500">{r.city}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                    {r.comment}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">{r.date}</span>
                    {r.verifiedPurchase && (
                      <span className="text-[10px] text-[#00e5ff] flex items-center gap-1 bg-[#00e5ff]/10 border border-[#00e5ff]/30 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
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
              <h3 className="text-sm font-black text-white flex items-center gap-2 mb-4 font-['Cairo']">
                <MessageSquarePlus className="w-4 h-4 text-[#00a3ff]" />
                شاركنا تقييمك
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="اسمك"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="bg-[#16223a] border border-[#27405f] text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                  />
                  <input
                    type="text"
                    placeholder="مدينتك"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-[#16223a] border border-[#27405f] text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                  />
                </div>

                <input
                  type="text"
                  placeholder="المنتج اللي اشتريته (اختياري)"
                  value={itemBought}
                  onChange={(e) => setItemBought(e.target.value)}
                  className="w-full bg-[#16223a] border border-[#27405f] text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#00a3ff]"
                />

                <div className="flex items-center justify-center gap-1.5 py-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const val = i + 1;
                    const active = val <= (hoverRating || rating);
                    return (
                      <button
                        type="button"
                        key={i}
                        onMouseEnter={() => setHoverRating(val)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(val)}
                        className="p-0.5 cursor-pointer"
                        aria-label={`${val} نجوم`}
                      >
                        <Star
                          className={`w-6 h-6 transition-colors ${
                            active ? "fill-amber-400 text-amber-400" : "text-gray-600"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <textarea
                  rows={3}
                  placeholder="اكتب تقييمك..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#16223a] border border-[#27405f] text-xs text-white rounded-xl p-3 focus:outline-none focus:border-[#00a3ff]"
                />

                {errorMsg && <p className="text-[11px] text-rose-400">{errorMsg}</p>}
                {successMsg && <p className="text-[11px] text-green-400">{successMsg}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-cyber-cyan text-black font-black text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MessageSquarePlus className="w-4 h-4" />
                  )}
                  <span>{submitting ? "جارٍ الإرسال..." : "إرسال التقييم"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
