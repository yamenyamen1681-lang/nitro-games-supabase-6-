"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import {
  Flame,
  ShoppingBag,
  Zap,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Eye,
  Percent,
  Sparkles,
} from "lucide-react";

interface DealsSectionProps {
  dealProducts: Product[];
  onQuickView?: (product: Product) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  dealProducts,
  onQuickView,
}) => {
  const { addToCart } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);

  // عداد تنازلي حقيقي
  const [timeLeft, setTimeLeft] = useState({ hours: 19, minutes: 59, seconds: 23 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeProducts = dealProducts.length > 0 ? dealProducts : [];
  const currentProduct = activeProducts[currentIndex];

  if (!currentProduct) return null;

  const discountPercent = currentProduct.originalPrice
    ? Math.round(
        ((currentProduct.originalPrice - currentProduct.price) /
          currentProduct.originalPrice) *
          100
      )
    : 90;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeProducts.length) % activeProducts.length);
  };

  return (
    <section className="relative overflow-hidden my-10 px-2 sm:px-4">
      {/* هالة الضوء النيون الخلفية الحارقة */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-[#ff0055]/20 via-[#00a3ff]/20 to-[#00e5ff]/20 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto rounded-3xl bg-[#050a15]/95 backdrop-blur-2xl border-2 border-[#162e52] hover:border-[#00e5ff]/60 shadow-[0_0_60px_rgba(0,163,255,0.2)] transition-all duration-500 overflow-hidden">
        
        {/* زوايا ديكورية سايبر (HUD Corner Accents) */}
        <span className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00e5ff] rounded-tr-2xl z-20 pointer-events-none shadow-[0_0_10px_#00e5ff]" />
        <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#ff0055] rounded-bl-2xl z-20 pointer-events-none shadow-[0_0_10px_#ff0055]" />

        {/* الهيدر العلوي للعروض الحماسية */}
        <div className="p-5 sm:p-6 border-b border-[#132747] bg-gradient-to-r from-[#0a1326] via-[#050b17] to-[#0a1326] flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-right">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#ff0055]/20 to-[#ff5500]/20 border border-[#ff0055]/50 text-[#ff0055] text-xs font-black font-tech shadow-[0_0_15px_rgba(255,0,85,0.4)]">
              <Flame className="w-4 h-4 animate-bounce text-[#ff0055]" />
              <span>NITRO FLASH DEALS</span>
              <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cairo'] tracking-wide">
              عروض الفلاش <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-[#00a3ff] to-[#ff0055]">الأسبوعية</span>
            </h2>
            <p className="text-xs text-gray-400 font-['Cairo']">
              وفر حتى <span className="text-[#00e5ff] font-bold text-sm">90%</span> على أعتى الملحقات الاحترافية
            </p>
          </div>

          {/* العداد التنازلي بخلفية رقمية شاحنة النيون */}
          <div className="flex items-center gap-2.5 bg-[#030712] px-5 py-3 rounded-2xl border border-[#1a355d] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" dir="ltr">
            <div className="text-center min-w-[45px]">
              <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none block drop-shadow-[0_0_10px_#ffffff]">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-gray-400 font-['Cairo'] mt-1 block">ساعة</span>
            </div>
            <span className="text-lg font-bold text-[#ff0055] animate-pulse">:</span>
            <div className="text-center min-w-[45px]">
              <span className="text-xl sm:text-2xl font-black text-white font-mono leading-none block drop-shadow-[0_0_10px_#ffffff]">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-gray-400 font-['Cairo'] mt-1 block">دقيقة</span>
            </div>
            <span className="text-lg font-bold text-[#00e5ff] animate-pulse">:</span>
            <div className="text-center min-w-[45px]">
              <span className="text-xl sm:text-2xl font-black text-[#00e5ff] font-mono leading-none block drop-shadow-[0_0_15px_#00e5ff]">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-gray-400 font-['Cairo'] mt-1 block">ثانية</span>
            </div>
          </div>
        </div>

        {/* جسم العرض الرئيسي - منصة عرض المنتجات */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* منصة العرض للمنتج (3D Cyber Platform) */}
          <div className="md:col-span-6 relative">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl bg-gradient-to-b from-[#0a1529]/90 via-[#050c19]/90 to-[#02060e] border border-[#1a3863] p-4 flex items-center justify-center group overflow-hidden shadow-inner">
              
              {/* شبكة أرضية النيون العائمة تحت المنتج */}
              <div 
                className="absolute inset-x-0 bottom-0 h-32 opacity-30 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(ellipse at bottom, rgba(0,229,255,0.4) 0%, transparent 70%)",
                }}
              />

              {/* وسام الخصم النيون المشع */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gradient-to-r from-[#ff0055] via-[#ff2a00] to-[#ff5500] text-white text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(255,0,85,0.8)] border border-white/20 animate-pulse">
                <Percent className="w-4 h-4" />
                <span>خصم {discountPercent}%</span>
              </div>

              {/* أزرار الإجراءات السريعة فوق الصورة */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                {onQuickView && (
                  <button
                    onClick={() => onQuickView(currentProduct)}
                    className="p-2.5 rounded-xl bg-[#060e1d]/80 border border-[#1c3a66] text-gray-300 hover:text-white hover:border-[#00e5ff] transition-all cursor-pointer backdrop-blur-md shadow-lg"
                    title="معاينة سريعة"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* صورة المنتج المسرحية */}
              <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.title}
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* حالة التوفر النيون */}
              <span className="absolute bottom-3 right-3 text-[10px] font-bold text-[#00e5ff] bg-[#030914]/90 border border-[#00e5ff]/40 px-3 py-1 rounded-full backdrop-blur-md shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                متوفر حالياً في المخزن
              </span>
            </div>

            {/* أزرار التبديل إن وجدت عدة منتجات */}
            {activeProducts.length > 1 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {activeProducts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? "w-7 bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" : "w-2 bg-[#12243e]"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-xl bg-[#091426] border border-[#1c3860] hover:border-[#00e5ff] text-gray-300 transition-colors shadow-md"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-2 rounded-xl bg-[#091426] border border-[#1c3860] hover:border-[#00e5ff] text-gray-300 transition-colors shadow-md"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* معلومات وتفاصيل العرض والأسعار */}
          <div className="md:col-span-6 text-right space-y-5">
            <div>
              <div className="inline-block text-[11px] font-tech text-[#00e5ff] font-bold uppercase bg-[#00e5ff]/10 px-3 py-0.5 rounded-md border border-[#00e5ff]/30 mb-2">
                {currentProduct.brand || "ATTACK SHARK"}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug font-['Cairo']">
                {currentProduct.title}
              </h3>
            </div>

            {/* شريط الضمان والمزايا */}
            <div className="flex items-center gap-2.5 text-xs text-gray-200 font-['Cairo'] bg-[#071120] p-3 rounded-xl border border-[#172e50]">
              <ShieldCheck className="w-5 h-5 text-[#00e5ff] shrink-0" />
              <span>ضمان رسمي لمدة 12 شهر شامل الصيانة والتطوير</span>
            </div>

            {/* عرض السعر النيون */}
            <div className="flex items-baseline gap-4 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-[#00e5ff] font-mono drop-shadow-[0_0_18px_rgba(0,229,255,0.6)]">
                {currentProduct.price.toLocaleString()} ₪
              </span>
              {currentProduct.originalPrice && (
                <span className="text-base font-mono text-gray-400 line-through">
                  {currentProduct.originalPrice.toLocaleString()} ₪
                </span>
              )}
            </div>

            {/* شريط الكمية المتبقية الحراري (Scarcity Bar) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-['Cairo']">
                <span className="text-gray-400">الكمية المتبقية للعرض:</span>
                <span className="text-[#ff0055] font-black flex items-center gap-1 text-sm animate-pulse">
                  <Flame className="w-4 h-4" /> متبقي 3 قطع فقط!
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#071120] rounded-full overflow-hidden border border-[#193256] p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#00a3ff] via-[#ff0055] to-[#ff5500] rounded-full shadow-[0_0_10px_#ff0055]"
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            {/* زر الشراء الضخم والنيون */}
            <div className="pt-2">
              <button
                onClick={() => addToCart(currentProduct, 1)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#00a3ff] via-[#00e5ff] to-[#00a3ff] hover:from-[#00e5ff] hover:to-[#00a3ff] text-black font-black text-base flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(0,163,255,0.4)] hover:shadow-[0_0_45px_rgba(0,229,255,0.7)] transition-all duration-300 font-['Cairo'] group"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>إضافة السلعة إلى السلة فوراً</span>
                <Zap className="w-5 h-5 fill-black" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
