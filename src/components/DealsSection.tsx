"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Eye, Heart, Flame, Zap } from "lucide-react";

interface DealsSectionProps {
  dealProducts: Product[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ dealProducts }) => {
  const { addToCart } = useCart();
  
  // حساب الوقت المتبقي (ساعات، دقائق، ثواني)
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 }; // إعادة تعيين بعد انتهائه
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="relative my-8 rounded-3xl p-4 sm:p-6 bg-[#080d1a]/80 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_40px_rgba(0,229,255,0.15)] overflow-hidden">
      {/* توهج الخلفية الفاخر */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-red-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* الهيدر العلوي لقسم العروض */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3 text-right">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/40 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                NITRO FLASH DEALS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              وفر حتى <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">20% إلى 90%</span> على العتاد
            </h2>
          </div>
        </div>

        {/* ⏰ عداد الوقت التنازلي المضبوط بالترتيب الصحيح (ساعة : دقيقة : ثانية) */}
        <div className="flex items-center gap-2 dir-rtl bg-[#040814]/90 p-2.5 rounded-2xl border border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          {/* 1. الساعات */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-[#18080c] to-[#0d0407] border border-red-500/60 flex items-center justify-center text-red-500 text-lg sm:text-xl font-black font-mono shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              {formatNum(timeLeft.hours)}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 font-bold">ساعة</span>
          </div>

          <span className="text-red-500 font-bold text-xl mb-4 animate-ping">:</span>

          {/* 2. الدقائق */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-[#18080c] to-[#0d0407] border border-red-500/60 flex items-center justify-center text-red-500 text-lg sm:text-xl font-black font-mono shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              {formatNum(timeLeft.minutes)}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 font-bold">دقيقة</span>
          </div>

          <span className="text-red-500 font-bold text-xl mb-4 animate-ping">:</span>

          {/* 3. الثواني */}
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-b from-[#18080c] to-[#0d0407] border border-red-500/60 flex items-center justify-center text-red-500 text-lg sm:text-xl font-black font-mono shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              {formatNum(timeLeft.seconds)}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 font-bold">ثانية</span>
          </div>
        </div>
      </div>

      {/* قائمة المنتجات المعروضة داخل الفلاش */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dealProducts.slice(0, 3).map((product) => {
          const discountPercent = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <div
              key={product.id}
              className="group relative rounded-2xl bg-[#081020]/80 border border-cyan-500/20 hover:border-cyan-400 p-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] flex flex-col justify-between overflow-hidden"
            >
              {/* شارة الخصم */}
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xs shadow-lg">
                  %{discountPercent}- خصم
                </div>
              )}

              {/* صورة المنتج */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-[#030712] mb-3 flex items-center justify-center p-2">
                <img
                  src={product.image}
                  alt={product.title}
                  className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* تفاصيل المنتج */}
              <div>
                <h3 className="text-sm font-bold text-white line-clamp-1 mb-2 text-right">
                  {product.title}
                </h3>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                  <button
                    onClick={() => addToCart(product)}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>إضافة للسلة</span>
                  </button>

                  <div className="text-left">
                    <span className="text-cyan-400 font-black text-base sm:text-lg block">
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
