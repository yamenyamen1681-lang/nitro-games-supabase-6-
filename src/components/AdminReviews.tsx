"use client";

import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Trash2,
  Plus,
  RefreshCw,
  User,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

type Review = {
  id: number;
  author: string;
  city: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

interface AdminReviewsProps {
  showToast: (
    message: string,
    type?: "success" | "error" | "info"
  ) => void;
}

export default function AdminReviews({
  showToast,
}: AdminReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("");
  const [comment, setComment] = useState("");
  const [adding, setAdding] = useState(false);

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

      const data = await response.json();

      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load reviews error:", error);
      showToast("تعذر تحميل التعليقات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const deleteReview = async (id: number) => {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا التعليق؟"
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

      const response = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Delete failed");
      }

      setReviews((current) =>
        current.filter((review) => review.id !== id)
      );

      showToast("تم حذف التعليق بنجاح", "success");
    } catch (error) {
      console.error("Delete review error:", error);
      showToast("تعذر حذف التعليق", "error");
    } finally {
      setDeleting(null);
    }
  };

  const addReview = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const cleanAuthor = author.trim();
    const cleanCity = city.trim();
    const cleanComment = comment.trim();

    if (!cleanAuthor || !cleanCity || !cleanComment) {
      showToast("يرجى تعبئة جميع الحقول", "error");
      return;
    }

    try {
      setAdding(true);

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: cleanAuthor,
          city: cleanCity,
          comment: cleanComment,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Add failed");
      }

      setAuthor("");
      setCity("");
      setComment("");
      setShowAddForm(false);

      await loadReviews();

      showToast("تمت إضافة التعليق بنجاح", "success");
    } catch (error) {
      console.error("Add review error:", error);
      showToast("تعذر إضافة التعليق", "error");
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "غير معروف";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("ar-PS", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div dir="rtl" className="space-y-5">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#00a3ff]" />

            <h2 className="text-xl font-bold text-white">
              إدارة التعليقات
            </h2>
          </div>

          <p className="mt-1 text-sm text-gray-400">
            إدارة تعليقات وآراء عملاء NITRO GAMES
          </p>
        </div>

        <div className="flex gap-2">

          {/* Refresh */}
          <button
            type="button"
            onClick={loadReviews}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg border border-[#26334d] bg-[#111827] px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#00a3ff] hover:text-white disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            تحديث
          </button>

          {/* Add */}
          <button
            type="button"
            onClick={() =>
              setShowAddForm((value) => !value)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#00a3ff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#008bd8]"
          >
            <Plus className="h-4 w-4" />
            إضافة تعليق
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={addReview}
          className="rounded-xl border border-[#26334d] bg-[#0d1525] p-5"
        >
          <div className="mb-4 flex items-center gap-2">
            <Plus className="h-4 w-4 text-[#00a3ff]" />

            <h3 className="font-semibold text-white">
              إضافة تعليق جديد
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* Author */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                اسم العميل
              </label>

              <input
                type="text"
                value={author}
                onChange={(event) =>
                  setAuthor(event.target.value)
                }
                placeholder="مثال: محمد"
                className="w-full rounded-lg border border-[#26334d] bg-[#080f1d] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#00a3ff]"
              />
            </div>

            {/* City */}
            <div>
              <label className="mb-2 block text-sm text-gray-300">
                المدينة
              </label>

              <input
                type="text"
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
                placeholder="مثال: جنين"
                className="w-full rounded-lg border border-[#26334d] bg-[#080f1d] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#00a3ff]"
              />
            </div>

            {/* Comment */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-gray-300">
                التعليق
              </label>

              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(event.target.value)
                }
                placeholder="اكتب تعليق العميل هنا..."
                rows={4}
                className="w-full resize-none rounded-lg border border-[#26334d] bg-[#080f1d] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-[#00a3ff]"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">

            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-[#26334d] px-5 py-2.5 text-sm text-gray-300 hover:bg-[#172033] hover:text-white"
            >
              إلغاء
            </button>

            <button
              type="submit"
              disabled={adding}
              className="flex items-center gap-2 rounded-lg bg-[#00a3ff] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#008bd8] disabled:opacity-50"
            >
              {adding ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  إضافة التعليق
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

        <div className="rounded-xl border border-[#26334d] bg-[#0d1525] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                إجمالي التعليقات
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {reviews.length}
              </p>
            </div>

            <div className="rounded-lg bg-[#00a3ff]/10 p-3">
              <MessageSquare className="h-5 w-5 text-[#00a3ff]" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#26334d] bg-[#0d1525] p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                مشتريات موثقة
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {
                  reviews.filter(
                    (review) =>
                      review.verifiedPurchase
                  ).length
                }
              </p>
            </div>

            <div className="rounded-lg bg-green-500/10 p-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-3">

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center rounded-xl border border-[#26334d] bg-[#0d1525]">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw className="h-5 w-5 animate-spin" />
              جاري تحميل التعليقات...
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-dashed border-[#26334d] bg-[#0d1525] text-center">
            <div className="mb-3 rounded-full bg-[#00a3ff]/10 p-4">
              <MessageSquare className="h-7 w-7 text-[#00a3ff]" />
            </div>

            <h3 className="font-semibold text-white">
              لا توجد تعليقات
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              لم يتم العثور على أي تعليقات حتى الآن
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-[#26334d] bg-[#0d1525] p-5 transition hover:border-[#354563]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div className="min-w-0 flex-1">

                  {/* User */}
                  <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#00a3ff]/10">
                      <User className="h-5 w-5 text-[#00a3ff]" />
                    </div>

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-white">
                          {review.author}
                        </h3>

                        {review.verifiedPurchase && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-[10px] font-medium text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            مشتري موثق
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">

                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {review.city}
                        </span>

                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(review.createdAt)}
                        </span>

                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mt-4 rounded-lg border border-[#1c2942] bg-[#080f1d] p-4">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() =>
                    deleteReview(review.id)
                  }
                  disabled={
                    deleting === review.id
                  }
                  title="حذف التعليق"
                  className="flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10 disabled:opacity-50"
                >
                  {deleting === review.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}

                  <span className="text-xs">
                    حذف
                  </span>
                </button>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Notice */}
      <div className="flex gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />

        <div>
          <p className="text-sm font-medium text-yellow-300">
            ملاحظة
          </p>

          <p className="mt-1 text-xs leading-6 text-yellow-200/70">
            التعليقات يتم تحميلها وحفظها من خلال
            /api/reviews.
          </p>
        </div>
      </div>

    </div>
  );
      }
