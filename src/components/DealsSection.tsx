"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Eye, Heart, Flame } from "lucide-react";

interface DealsSectionProps {
  dealProducts: Product[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ dealProducts }) => {
  const { addToCart } = useCart();

  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 59, seconds: 7 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="my-8 rounded-3xl p-6 bg-[#080d1a]/90 border border-[#00a3ff]/30 backdrop-blur-md relative overflow-hidden">
      {/* رأس قسم العروض */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
              <Flame className="w-4 h-4 animate-bounce" />
              NITRO FLASH DEALS
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400">
              عروض الفلاش الأسبوعية 🔥
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            وفر حتى <span className="text-[#00a3ff]">20% إلى 90%</span> على العتاد
          </h2>
        </div>

        {/* ⏰ عداد الوقت التنازلي التفاعلي المرتّب (ساعة : دقيقة : ثانية) */}
        <div className="flex items-center gap-3 bg-[#03060c] px-6 py-3 rounded-2xl border border-red-500/30">
          {/* 1. الساعة */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-500 text-xl font-bold font-mono">
              {formatNum(timeLeft.hours)}
            </div>
            <span className="text-[10px] text-gray-400 mt-1">ساعة</span>
          </div>

          <span className="text-red-500 font-bold text-xl mb-4">:</span>

          {/* 2. الدقيقة */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-500 text-xl font-bold font-mono">
              {formatNum(timeLeft.minutes)}
            </div>
            <span className="text-[10px] text-gray-400 mt-1">دقيقة</span>
          </div>

          <span className="text-red-500 font-bold text-xl mb-4">:</span>

          {/* 3. الثانية */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center justify-center text-red-500 text-xl font-bold font-mono">
              {formatNum(timeLeft.seconds)}
            </div>
            <span className="text-[10px] text-gray-400 mt-1">ثانية</span>
          </div>
        </div>
      </div>

      {/* عرض المنتجات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealProducts.slice(0, 3).map((product) => {
          const discountPercent = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className="group relative rounded-2xl bg-[#0b1120] border border-white/10 hover:border-[#00a3ff]/50 p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,163,255,0.2)] flex flex-col justify-between"
            >
              {discountPercent > 0 && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-orange-500 text-white font-bold text-xs shadow-lg">
                  %{discountPercent}- خصم
                </div>
              )}

              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-[#03060c] mb-4 flex items-center justify-center p-2">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-white line-clamp-1 mb-2 text-right">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => addToCart(product)}
                    className="px-4 py-2 rounded-xl bg-[#00a3ff] hover:bg-[#00a3ff]/80 text-black font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    إضافة للسلة
                  </button>

                  <div className="text-left">
                    <span className="text-[#00a3ff] font-bold text-lg block">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-gray-500 line-through text-xs block">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
