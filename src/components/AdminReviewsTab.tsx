"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, Loader2, Star } from "lucide-react";

export const AdminReviewsTab: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // جلب كل التقييمات للوحة التحكم
  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // دالة حذف التقييم
  const handleDelete = async (id: string | number) => {
    if (!confirm("هل أنت متأكد من حذف هذا التقييم نهائياً؟")) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (!error) {
      setReviews(reviews.filter((r) => r.id !== id));
      showToast("تم حذف التقييم بنجاح 🗑️");
    } else {
      showToast("حدث خطأ أثناء حذف التقييم ⚠️");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-400 gap-2 text-xs">
        <Loader2 className="w-4 h-4 animate-spin" />
        جاري تحميل التقييمات...
      </div>
    );
  }

  return (
    <div className="space-y-3 text-right" dir="rtl">
      <h3 className="text-sm font-black text-white font-['Cairo'] mb-4">
        إدارة وحذف التقييمات ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <p className="text-gray-400 text-xs text-center py-8">لا توجد تقييمات حالياً.</p>
      ) : (
        reviews.map((rev) => (
          <div
            key={rev.id}
            className="flex items-center justify-between bg-[#152034] border border-[#27405f] p-4 rounded-xl"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{rev.name}</span>
                <span className="text-[10px] text-gray-400">({rev.city})</span>
                <div className="flex items-center text-amber-400 text-xs">
                  {"⭐".repeat(rev.rating || 5)}
                </div>
              </div>
              <p className="text-gray-300 text-xs">{rev.comment}</p>
              <span className="text-[10px] text-[#00e5ff] block">{rev.product_tag}</span>
            </div>

            <button
              onClick={() => handleDelete(rev.id)}
              className="px-3 py-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          </div>
        ))
      )}
    </div>
  );
};
