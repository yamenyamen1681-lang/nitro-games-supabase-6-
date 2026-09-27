"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Eye, Heart, Flame } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// استيراد تنسيقات Swiper الأساسية
import "swiper/css";
import "swiper/css/pagination";

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

        <h2 className="text-xl sm:text-3xl font-black text-white leading-snug">
          وفر حتى <span className="text-[#00a3ff]">20% إلى 90%</span> على العتاد
        </h2>
      </div>

      {/* 2. صندوق العد التنازلي التفاعلي المرتّب (ساعة : دقيقة : ثانية) */}
      <div className="w-full max-w-lg mx-auto mb-8 p-4 rounded-2xl bg-[#02050c] border border-red-900/60 flex items-center justify-center gap-2 sm:gap-4 dir-rtl">
        {/* ساعة */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-12 sm:w-16 sm:h-14 rounded-2xl bg-[#1a050a] border border-red-600/70 flex items-center justify-center text-red-500 text-lg sm:text-2xl font-black font-mono shadow-[0_0_15px_rgba(239,68,68,0.25)]">
            {formatNum(timeLeft.hours)}
          </div>
          <span className="text-xs text-gray-400 mt-2 font-bold">ساعة</span>
        </div>

        <span className="text-red-600 font-bold text-xl pb-6">:</span>

        {/* دقيقة */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-12 sm:w-16 sm:h-14 rounded-2xl bg-[#1a050a] border border-red-600/70 flex items-center justify-center text-red-500 text-lg sm:text-2xl font-black font-mono shadow-[0_0_15px_rgba(239,68,68,0.25)]">
            {formatNum(timeLeft.minutes)}
          </div>
          <span className="text-xs text-gray-400 mt-2 font-bold">دقيقة</span>
        </div>

        <span className="text-red-600 font-bold text-xl pb-6">:</span>

        {/* ثانية */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-12 sm:w-16 sm:h-14 rounded-2xl bg-[#1a050a] border border-red-600/70 flex items-center justify-center text-red-500 text-lg sm:text-2xl font-black font-mono shadow-[0_0_15px_rgba(239,68,68,0.25)]">
            {formatNum(timeLeft.seconds)}
          </div>
          <span className="text-xs text-gray-400 mt-2 font-bold">ثانية</span>
        </div>
      </div>

      {/* 3. سلايدر العروض التلقائي في صف واحد (Carousel) */}
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-12"
      >
        {dealProducts.map((product) => {
          const discountPercent = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

          return (
            <SwiperSlide key={product.id}>
              <div className="group relative rounded-2xl bg-[#060c1a] border border-[#00a3ff]/30 hover:border-[#00a3ff] p-4 transition-all duration-300 flex flex-col justify-between h-full">
                {/* أدوات المعاينة وشارة الخصم */}
                <div className="flex items-center justify-between mb-3 z-10">
                  <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl bg-[#02050c] border border-white/10 text-gray-300 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-[#02050c] border border-white/10 text-gray-300 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  {discountPercent > 0 && (
                    <div className="px-3 py-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-md">
                      %{discountPercent}- خصم
                    </div>
                  )}
                </div>

                {/* منطقة صورة المنتج بالشبكة النقطية */}
                <div 
                  className="relative w-full h-52 rounded-2xl overflow-hidden bg-[#02050c] mb-4 flex items-center justify-center p-3 border border-white/5"
                  style={{
                    backgroundImage: "radial-gradient(rgba(0, 163, 255, 0.15) 1px, transparent 1px)",
                    backgroundSize: "16px 16px"
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* الشارات السفلية فوق السعر */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-3 py-1 rounded-xl bg-[#02050c] text-[#00a3ff] font-bold border border-[#00a3ff]/30">
                    متوفر حالياً
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#02050c] text-[#00a3ff] font-bold border border-[#00a3ff]/30">
                    NITRO GAMES
                  </span>
                </div>

                {/* تفاصيل المنتج والسعر وزر الإضافة */}
                <div>
                  <h3 className="text-base font-bold text-white line-clamp-1 mb-3 text-right">
                    {product.title}
                  </h3>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-2.5 rounded-xl bg-[#00a3ff] hover:bg-[#00a3ff]/80 text-black font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,163,255,0.3)]"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      إضافة للسلة
                    </button>

                    <div className="text-left">
                      <span className="text-[#00a3ff] font-black text-lg block">
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
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};
