"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Eye, Heart, Flame, ChevronRight, ChevronLeft } from "lucide-react";

interface DealsSectionProps {
  dealProducts: Product[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ dealProducts }) => {
  const { addToCart } = useCart();

  // عداد الوقت
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 59, seconds: 7 });

  // مؤشر المنتج المعروض حالياً
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // التبديل التلقائي بين المنتجات كل 3 ثوانٍ
  useEffect(() => {
    if (!dealProducts || dealProducts.length === 0) return;
    const sliderTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % dealProducts.length);
    }, 3000);
    return () => clearInterval(sliderTimer);
  }, [dealProducts]);

  const formatNum = (num: number) => String(num).padStart(2, "0");

  if (!dealProducts || dealProducts.length === 0) return null;

  const currentProduct = dealProducts[currentIndex];
  const discountPercent = currentProduct.originalPrice
    ? Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100)
    : 0;

  return (
    <section className="my-6 rounded-3xl p-4 sm:p-6 bg-[#040914] border border-[#00a3ff]/40 relative overflow-hidden text-right">
      {/* 1. قسم العناوين والشارات */}
      <div className="flex flex-col items-center text-center space-y-3 mb-6">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#081226] text-[#00a3ff] border border-[#00a3ff]/30">
            NITRO FLASH DEALS
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-950/60 text-red-400 border border-red-500/40 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
            عروض الفلاش الأسبوعية
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
          وفر حتى <span className="text-[#00a3ff]">20% إلى 90%</span> على العتاد
        </h2>
      </div>

      {/* 2. العداد المرتّب الصحيح: (ساعة : دقيقة : ثانية) */}
      <div className="w-full max-w-xs sm:max-w-sm mx-auto mb-6 p-3 rounded-2xl bg-[#02050c] border border-red-900/60 flex items-center justify-center gap-2 dir-rtl">
        {/* ساعة */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-11 rounded-xl bg-[#1a050a] border border-red-600/70 flex items-center justify-center text-red-500 text-lg font-black font-mono shadow-[0_0_12px_rgba(239,68,68,0.25)]">
            {formatNum(timeLeft.hours)}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 font-bold">ساعة</span>
        </div>

        <span className="text-red-600 font-bold text-lg pb-4">:</span>

        {/* دقيقة */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-11 rounded-xl bg-[#1a050a] border border-red-600/70 flex items-center justify-center text-red-500 text-lg font-black font-mono shadow-[0_0_12px_rgba(239,68,68,0.25)]">
            {formatNum(timeLeft.minutes)}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 font-bold">دقيقة</span>
        </div>

        <span className="text-red-600 font-bold text-lg pb-4">:</span>

        {/* ثانية */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-11 rounded-xl bg-[#1a050a] border border-red-600/70 flex items-center justify-center text-red-500 text-lg font-black font-mono shadow-[0_0_12px_rgba(239,68,68,0.25)]">
            {formatNum(timeLeft.seconds)}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 font-bold">ثانية</span>
        </div>
      </div>

      {/* 3. منتج واحد مع تبديل سلس ورا بعضه */}
      <div className="max-w-sm mx-auto relative">
        <div key={currentProduct.id} className="group relative rounded-2xl bg-[#060c1a] border border-[#00a3ff]/30 hover:border-[#00a3ff] p-4 transition-all duration-500 flex flex-col justify-between">
          {/* أدوات المعاينة وشارة الخصم */}
          <div className="flex items-center justify-between mb-3 z-10">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl bg-[#02050c] border border-white/10 text-gray-300 hover:text-white transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-xl bg-[#02050c] border border-white/10 text-gray-300 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {discountPercent > 0 && (
              <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-md">
                %{discountPercent}- خصم
              </div>
            )}
          </div>

          {/* صورة المنتج */}
          <div 
            className="relative w-full h-48 rounded-2xl overflow-hidden bg-[#02050c] mb-4 flex items-center justify-center p-3 border border-white/5"
            style={{
              backgroundImage: "radial-gradient(rgba(0, 163, 255, 0.15) 1px, transparent 1px)",
              backgroundSize: "16px 16px"
            }}
          >
            <img
              src={currentProduct.image}
              alt={currentProduct.title}
              className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* الشارات السفلية */}
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="px-2.5 py-1 rounded-xl bg-[#02050c] text-[#00a3ff] font-bold border border-[#00a3ff]/30 text-[11px]">
              متوفر حالياً
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-[#02050c] text-[#00a3ff] font-bold border border-[#00a3ff]/30 text-[11px]">
              NITRO GAMES
            </span>
          </div>

          {/* تفاصيل وسعر المنتج */}
          <div>
            <h3 className="text-base font-bold text-white line-clamp-1 mb-3 text-right">
              {currentProduct.title}
            </h3>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => addToCart(currentProduct)}
                className="px-4 py-2 rounded-xl bg-[#00a3ff] hover:bg-[#00a3ff]/80 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,163,255,0.3)]"
              >
                <ShoppingCart className="w-4 h-4" />
                إضافة للسلة
              </button>

              <div className="text-left">
                <span className="text-[#00a3ff] font-black text-base block">
                  ${currentProduct.price}
                </span>
                {currentProduct.originalPrice && (
                  <span className="text-gray-500 line-through text-xs block">
                    ${currentProduct.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* نقاط التصفح السفلية Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {dealProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-[#00a3ff]" : "w-2 bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
