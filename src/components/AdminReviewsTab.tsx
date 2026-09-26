"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  MessageSquarePlus,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

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
      const response = await fetch("/api/reviews", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "تعذر تحميل التقييمات"
        );
      }

      setReviewsList(data.reviews || []);
    } catch (error) {
      console.warn("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();

    // تحديث التعليقات مباشرة عند إضافة أو حذف تعليق
    const channel = supabase
      .channel("reviews-live-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
        },
        () => {
          loadReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");

    if (
      !author.trim() ||
      !city.trim() ||
      !comment.trim()
    ) {
      setErrorMsg(
        "يرجى تعبئة الاسم والمدينة والتعليق"
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
          rating,
          comment: comment.trim(),
          itemBought:
            itemBought.trim() ||
            "منتج من المتجر",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "تعذر إرسال التقييم"
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

      // تحديث فوري لصاحب التعليق
      loadReviews();
    } catch (error) {
      console.warn(
        "Review submit error:",
        error
      );

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
      className="relative py-16 sm:py-20 border-t border-[#16223a]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="text-[11px] font-tech text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-gradient-to-l from-[#00a3ff]/50 to-transparent" />

            آراء عملائنا

            <span className="w-10 h-px bg-gradient-to-r from-[#00e5ff]/50 to-transparent" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cairo']">
            شو قالوا عنا؟
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            تقييمات حقيقية من عملاء NITRO GAMES بفلسطين
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Reviews */}
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
                <div
                  key={r.id}
                  className="panel rounded-2xl p-5 text-right"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({
                        length: 5,
                      }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-600"
                          }`}
                        />
                      ))}
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

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-3">
                    {r.comment}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">
                      {r.date}
                    </span>

                    {r.verifiedPurchase && (
                      <span className="
