"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Eye, Heart, Flame, Zap, ShieldCheck } from "lucide-react";

interface DealsSectionProps {
  dealProducts: Product[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ dealProducts }) => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 59, seconds: 7 });
  const [currentIndex, setCurrentIndex] = useState(0);

  // عداد الوقت التنازلي
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

  // التبديل التلقائي السلس بين المنتجات
  useEffect(() => {
    if (!dealProducts || dealProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dealProducts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [dealProducts]);

  const formatNum = (num: number) => String(num).padStart(2, "0");

  if (!dealProducts || dealProducts.length === 0) return null;

  const product = dealProducts[currentIndex];
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <section className="my-8 relative rounded-[2.5rem] p-5 sm:p-8 bg-gradient-to-b from-[#060c1d] via-[#040814] to-[#02040a] border border-[#00a3ff]/40 shadow-[0_0_50px_rgba(0,163,255,0.15)] overflow-hidden text-right">
      
      {/* خلفية نيون ديكورية */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#00a3ff]/20 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-red-600/20 rounded-full blur-[90px] pointer-events-none" />

      {/* 1. Header القسم الرئيسي */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-3 mb-6">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold bg-[#00a3ff]/10 text-[#00a3ff] border border-[#00a3ff]/40 shadow-[0_0_10px_rgba(0,163,255,0.2)] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 animate-pulse text-[#00a3ff]" />
            NITRO FLASH DEALS
          </span>
          <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1.5 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-bounce" />
            عروض الفلاش الأسبوعية
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
          وفر حتى <span className="bg-gradient-to-r from-[#00a3ff] to-cyan-300 bg-clip-text text-transparent">20% إلى 90%</span> على العتاد
        </h2>
      </div>

      {/* 2. عداد النيون التفاعلي (ساعة : دقيقة : ثانية) */}
      <div className="relative z-10 w-full max-w-sm mx-auto mb-8 p-3.5 rounded-2xl bg-[#020612]/90 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] flex items-center justify-center gap-2.5 dir-rtl">
        {/* ساعة */}
        <div className="flex flex-col items-center">
          <div className="w-13 h-12 sm:w-16 sm:h-14 rounded-xl bg-gradient-to-b from-[#1a050a] to-[#0d0205] border border-red-500/60 flex items-center justify-center text-red-400 text-xl sm:text-2xl font-black font-mono shadow-[inset_0_0_10px_rgba(239,68,68,0.3)]">
            {formatNum(timeLeft.hours)}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 font-bold tracking-wider">ساعة</span>
        </div>

        <span className="text-red-500 font-black text-xl pb-4 animate-pulse">:</span>

        {/* دقيقة */}
        <div className="flex flex-col items-center">
          <div className="w-13 h-12 sm:w-16 sm:h-14 rounded-xl bg-gradient-to-b from-[#1a050a] to-[#0d0205] border border-red-500/60 flex items-center justify-center text-red-400 text-xl sm:text-2xl font-black font-mono shadow-[inset_0_0_10px_rgba(239,68,68,0.3)]">
            {formatNum(timeLeft.minutes)}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 font-bold tracking-wider">دقيقة</span>
        </div>

        <span className="text-red-500 font-black text-xl pb-4 animate-pulse">:</span>

        {/* ثانية */}
        <div className="flex flex-col items-center">
          <div className="w-13 h-12 sm:w-16 sm:h-14 rounded-xl bg-gradient-to-b from-[#1a050a] to-[#0d0205] border border-red-500/60 flex items-center justify-center text-red-400 text-xl sm:text-2xl font-black font-mono shadow-[inset_0_0_10px_rgba(239,68,68,0.3)]">
            {formatNum(timeLeft.seconds)}
          </div>
          <span className="text-[10px] text-gray-400 mt-1 font-bold tracking-wider">ثانية</span>
        </div>
      </div>

      {/* 3. الكرت الأسطوري المعروض حالياً */}
      <div className="relative z-10 max-w-sm mx-auto">
        <div 
          key={product.id}
          className="group relative rounded-3xl bg-gradient-to-b from-[#09132b]/80 to-[#030814]/90 border border-[#00a3ff]/40 p-5 transition-all duration-500 hover:border-[#00a3ff] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          {/* الأزرار العلوية وشارة الخصم */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button className="p-2.5 rounded-xl bg-[#02050e] border border-white/10 text-gray-400 hover:text-white transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2.5 rounded-xl bg-[#02050e] border border-white/10 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {discountPercent > 0 && (
              <div className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-xs shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                %{discountPercent}- خصم
              </div>
            )}
          </div>

          {/* صورة المنتج مع الخلفية المرتكزة */}
          <div 
            className="relative w-full h-52 rounded-2xl overflow-hidden bg-[#02050d] mb-4 flex items-center justify-center p-4 border border-[#00a3ff]/20 shadow-[inner_0_0_20px_rgba(0,163,255,0.1)]"
            style={{
              backgroundImage: "radial-gradient(rgba(0, 163, 255, 0.2) 1.2px, transparent 1.2px)",
              backgroundSize: "14px 14px"
            }}
          >
            <img
              src={product.image}
              alt={product.title}
              className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* شارات الحالة */}
          <div className="flex items-center justify-between text-xs mb-4">
            <span className="px-3 py-1 rounded-xl bg-[#00a3ff]/10 text-[#00a3ff] font-bold border border-[#00a3ff]/30 flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              متوفر حالياً
            </span>
            <span className="px-3 py-1 rounded-xl bg-white/5 text-gray-300 font-bold border border-white/10 text-[11px]">
              NITRO GAMES
            </span>
          </div>

          {/* الاسم، السعر، وزر الشراء */}
          <div>
            <h3 className="text-lg font-black text-white line-clamp-1 mb-4 text-right">
              {product.title}
            </h3>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                onClick={() => addToCart(product)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#0077ff] hover:from-[#0082cc] hover:to-[#0055cc] text-black font-black text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,163,255,0.4)] active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                إضافة للسلة
              </button>

              <div className="text-left">
                <span className="text-[#00a3ff] font-black text-xl block leading-none">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-500 line-through text-xs font-bold block mt-1">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* نقاط الإشارات السفلية المبتكرة للتبديل */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {dealProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-gradient-to-r from-[#00a3ff] to-cyan-400 shadow-[0_0_10px_rgba(0,163,255,0.8)]"
                  : "w-2.5 bg-gray-800 hover:bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
