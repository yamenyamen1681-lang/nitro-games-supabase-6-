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
  const [timeLeft, setTimeLeft] = useState({ hours: 19, minutes: 59, seconds: 18 });

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
    : 20;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeProducts.length) % activeProducts.length);
  };

  return (
    <section className="relative overflow-hidden my-8 px-2 sm:px-4">
      {/* خلفية الإضاءة المتوهجة */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#00a3ff]/15 via-[#ff0055]/10 to-[#00e5ff]/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-4xl mx-auto rounded-3xl bg-[#070c18]/90 backdrop-blur-xl border border-[#1b2b48] shadow-[0_0_50px_rgba(0,163,255,0.15)] overflow-hidden">
        
        {/* الهيدر العلوي للعروض */}
        <div className="p-5 sm:p-6 border-b border-[#162744] bg-gradient-to-r from-[#0d172a] via-[#091120] to-[#0d172a] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-right">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff0055]/10 border border-[#ff0055]/30 text-[#ff0055] text-xs font-black font-tech">
              <Flame className="w-4 h-4 animate-bounce text-[#ff0055]" />
              <span>NITRO FLASH DEALS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Cairo']">
              عروض الفلاش <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#00a3ff]">الأسبوعية</span>
            </h2>
            <p className="text-xs text-gray-400 font-['Cairo']">
              وفر حتى <span className="text-[#00e5ff] font-bold">90%</span> على العتاد الاحترافي
            </p>
          </div>

          {/* العداد التنازلي التفاعلي */}
          <div className="flex items-center gap-2 bg-[#040812] px-4 py-2.5 rounded-2xl border border-[#1a2e4d] shadow-inner" dir="ltr">
            <div className="text-center min-w-[42px]">
              <span className="text-lg font-black text-white font-mono leading-none block">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-gray-400 font-['Cairo'] mt-1 block">ساعة</span>
            </div>
            <span className="text-sm font-bold text-[#00a3ff] animate-pulse">:</span>
            <div className="text-center min-w-[42px]">
              <span className="text-lg font-black text-white font-mono leading-none block">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-gray-400 font-['Cairo'] mt-1 block">دقيقة</span>
            </div>
            <span className="text-sm font-bold text-[#00a3ff] animate-pulse">:</span>
            <div className="text-center min-w-[42px]">
              <span className="text-lg font-black text-[#00e5ff] font-mono leading-none block">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] text-gray-400 font-['Cairo'] mt-1 block">ثانية</span>
            </div>
          </div>
        </div>

        {/* جسم العرض الرئيسي */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* الجانب الأيسر/الأول: صورة المنتج مع وسام الخصم والتحكم */}
          <div className="md:col-span-6 relative">
            <div className="relative h-60 sm:h-72 w-full rounded-2xl bg-gradient-to-b from-[#0e1a2f]/80 to-[#060b14]/90 border border-[#1a2d4c] p-4 flex items-center justify-center group overflow-hidden">
              
              {/* وسام الخصم العائم */}
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gradient-to-r from-[#ff0055] to-[#ff5500] text-white text-xs font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,0,85,0.5)]">
                <Percent className="w-3.5 h-3.5" />
                <span>خصم {discountPercent}%</span>
              </div>

              {/* أزرار الإجراءات السريعة فوق الصورة */}
              <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                {onQuickView && (
                  <button
                    onClick={() => onQuickView(currentProduct)}
                    className="p-2 rounded-xl bg-[#081222]/80 border border-[#1a2e4d] text-gray-300 hover:text-white hover:border-[#00a3ff] transition-all cursor-pointer backdrop-blur-md"
                    title="معاينة سريعة"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* صورة المنتج */}
              <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.title}
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>

              {/* حالة التوفر */}
              <span className="absolute bottom-3 right-3 text-[10px] font-bold text-[#00e5ff] bg-[#050c18]/90 border border-[#00e5ff]/30 px-3 py-1 rounded-full backdrop-blur-md">
                متوفر حالياً في المخزن
              </span>
            </div>

            {/* أزرار التبديل إذا كان هناك أكثر من منتج */}
            {activeProducts.length > 1 && (
              <div className="flex items-center justify-between mt-3 px-1">
                <div className="flex items-center gap-1.5">
                  {activeProducts.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? "w-6 bg-[#00e5ff]" : "w-2 bg-[#172b49]"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg bg-[#0d182b] border border-[#1a2e4d] hover:border-[#00a3ff] text-gray-300 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1.5 rounded-lg bg-[#0d182b] border border-[#1a2e4d] hover:border-[#00a3ff] text-gray-300 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* الجانب الأيمن/الثاني: التفاصيل، الأسعار، شريط المخزون والأزرار */}
          <div className="md:col-span-6 text-right space-y-4">
            <div>
              <div className="inline-block text-[11px] font-tech text-[#00a3ff] uppercase bg-[#00a3ff]/10 px-2.5 py-0.5 rounded-md border border-[#00a3ff]/20 mb-2">
                {currentProduct.brand || "ATTACK SHARK"}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug font-['Cairo']">
                {currentProduct.title}
              </h3>
            </div>

            {/* شريط الضمان والمزايا */}
            <div className="flex items-center gap-2 text-xs text-gray-300 font-['Cairo'] bg-[#091322] p-2.5 rounded-xl border border-[#162742]">
              <ShieldCheck className="w-4 h-4 text-[#00e5ff] shrink-0" />
              <span>ضمان رسمي لمدة 12 شهر شامل الصيانة والتطوير</span>
            </div>

            {/* عرض السعر */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#00e5ff] font-mono drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
                {currentProduct.price.toLocaleString()} ₪
              </span>
              {currentProduct.originalPrice && (
                <span className="text-sm font-mono text-gray-400 line-through">
                  {currentProduct.originalPrice.toLocaleString()} ₪
                </span>
              )}
            </div>

            {/* شريط المتبقي من المخزون (مؤشر الاستعجال) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-['Cairo']">
                <span className="text-gray-400">الكمية المتبقية للعرض:</span>
                <span className="text-[#ff0055] font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3" /> متبقي 3 قطع فقط!
                </span>
              </div>
              <div className="w-full h-2 bg-[#0d182b] rounded-full overflow-hidden border border-[#182a46]">
                <div
                  className="h-full bg-gradient-to-r from-[#00a3ff] via-[#ff0055] to-[#ff5500] rounded-full animate-pulse"
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            {/* زر الإضافة للسلة */}
            <div className="pt-2">
              <button
                onClick={() => addToCart(currentProduct, 1)}
                className="w-full btn-neon py-3.5 px-6 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold cursor-pointer group shadow-[0_0_25px_rgba(0,163,255,0.3)] hover:shadow-[0_0_35px_rgba(0,229,255,0.5)] transition-all"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>إضافة السلعة إلى السلة فوراً</span>
                <Zap className="w-4 h-4 text-[#00e5ff]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
