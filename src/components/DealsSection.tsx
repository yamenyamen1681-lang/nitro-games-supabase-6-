"use client";

import React, { useState, useEffect } from "react";
import { Timer, Zap, Heart, Eye, ShoppingCart, CheckCircle, Sparkles } from "lucide-react";
import { Product } from "@/lib/data";

interface DealsSectionProps {
  dealProducts?: Product[] | any[];
  products?: Product[] | any[];
  targetDate?: string;
}

// 1. مكون العداد التنازلي
const DealCountdown = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-full my-3">
      <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-r from-[#00a3ff]/40 via-[#00e5ff]/60 to-[#00a3ff]/40 shadow-[0_0_25px_rgba(0,163,255,0.25)]">
        <div className="bg-[#070e1c] rounded-[15px] p-4 border border-[#16294a]">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#00e5ff] animate-bounce" />
            <span className="text-xs font-bold text-[#00e5ff] tracking-wider font-['Cairo']">
              ينتهي العرض الخاص خلال
            </span>
            <Timer className="w-4 h-4 text-[#00a3ff]" />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center" dir="ltr">
            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 bg-gradient-to-b from-[#0b1b36] to-[#050b17] border border-[#00a3ff]/50 rounded-xl shadow-[inset_0_0_12px_rgba(0,163,255,0.3)]">
                <span className="text-xl sm:text-2xl font-black font-mono text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1 font-['Cairo']">ساعة</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 bg-gradient-to-b from-[#0b1b36] to-[#050b17] border border-[#00a3ff]/50 rounded-xl shadow-[inset_0_0_12px_rgba(0,163,255,0.3)]">
                <span className="text-xl sm:text-2xl font-black font-mono text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1 font-['Cairo']">دقيقة</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 bg-gradient-to-b from-[#0b1b36] to-[#050b17] border border-[#00e5ff] rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.4)] animate-pulse">
                <span className="text-xl sm:text-2xl font-black font-mono text-[#00e5ff] drop-shadow-[0_0_12px_rgba(0,229,255,1)]">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#00e5ff] mt-1 font-['Cairo']">ثانية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. مكون العروض المدمج (بدون زر الصوت)
export const DealsSection: React.FC<DealsSectionProps> = ({
  dealProducts = [],
  products = [],
  targetDate = "2026-10-01T00:00:00",
}) => {
  const [slide, setSlide] = useState(0);
  const itemsList = dealProducts.length > 0 ? dealProducts : products;

  useEffect(() => {
    if (itemsList.length <= 1) return;
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % itemsList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [itemsList.length]);

  const currentItem = itemsList[slide] || {};
  const itemTitle = currentItem.title || currentItem.name || "X82PRO HE Comic";
  const imageUrl =
    currentItem.image_url ||
    currentItem.image ||
    currentItem.images?.[0] ||
    "/keyboard.png";

  return (
    <section className="w-full max-w-md mx-auto px-4 py-4 text-white" dir="rtl">
      {/* العداد التنازلي */}
      <DealCountdown targetDate={targetDate} />

      {/* كرت العروض الرئيسي مع الإطار النيون المتحرك */}
      <div className="relative group p-[2px] rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(0,229,255,0.25)]">
        
        {/* حزام الليزر الدوار حول الإطار */}
        <div className="absolute -inset-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_300deg,#00e5ff_340deg,#00a3ff_360deg)] opacity-100" />

        {/* الكرت الداخلي */}
        <div className="relative bg-[#081225] rounded-[22px] p-4 border border-[#16294a] backdrop-blur-xl z-10">
          
          {/* الشريط العلوي: شارة SPECIAL OFFER والأزرار */}
          <div className="flex items-center justify-between mb-3 px-1">
            
            {/* SPECIAL OFFER (جهة اليمين) */}
            <div className="flex items-center gap-2 bg-[#09172e]/90 border border-[#00e5ff]/40 px-3 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,229,255,0.25)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5ff]"></span>
              </span>
              <span className="text-[11px] font-black tracking-widest text-[#00e5ff] font-mono uppercase">
                SPECIAL OFFER
              </span>
            </div>

            {/* الأزرار العلوية (جهة اليسار): المفضلة والمعاينة فقط */}
            <div className="flex items-center gap-2">
              <button className="p-2 bg-[#0d1d3a] rounded-xl hover:text-white border border-[#1a3363] transition">
                <Heart className="w-4 h-4 text-gray-400" />
              </button>
              <button className="p-2 bg-[#0d1d3a] rounded-xl hover:text-white border border-[#1a3363] transition">
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
            </div>

          </div>

          {/* حاوية المنتج وصورة الكيبورد */}
          <div className="relative w-full h-52 my-3 flex items-center justify-center bg-[#050b17] rounded-xl border border-[#16294a] overflow-hidden group">
            
            {/* شارة رقم الصورة */}
            <div className="absolute top-2.5 left-2.5 z-20 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg font-mono">
              {slide + 1} / {itemsList.length || 1}
            </div>

            {/* شارة الخصم */}
            <div className="absolute top-2.5 right-2.5 z-20">
              <span className="bg-gradient-to-r from-[#ff9900] to-[#ff5500] text-black font-black text-xs px-3 py-1 rounded-full shadow-[0_0_10px_rgba(255,153,0,0.4)]">
                خصم 90%-
              </span>
            </div>

            {/* نمط النقاط خلف الصورة */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(rgba(0, 229, 255, 0.4) 1px, transparent 1px)`,
                backgroundSize: `14px 14px`
              }}
            />

            <div className="absolute w-32 h-32 bg-[#00a3ff]/20 rounded-full blur-2xl pointer-events-none" />

            <img
              key={slide}
              src={imageUrl}
              alt={itemTitle}
              className="relative z-10 max-h-44 max-w-full object-contain p-2 transition-all duration-500 ease-in-out transform hover:scale-105"
            />
          </div>

          {/* اسم المتجر والحالة */}
          <div className="flex justify-between items-center text-xs mb-3">
            <span className="bg-[#0f2347] border border-[#1d3d7a] text-gray-300 px-3 py-1 rounded-lg font-mono text-[10px]">
              NITRO GAMES
            </span>
            <span className="text-[#00e5ff] flex items-center gap-1 bg-[#00e5ff]/10 border border-[#00e5ff]/30 px-2.5 py-1 rounded-lg text-[10px] font-bold">
              <CheckCircle className="w-3 h-3" /> متوفر حالياً
            </span>
          </div>

          {/* عنوان المنتج */}
          <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00e5ff]" />
            {itemTitle}
          </h3>

          {/* السعر وزر الإضافة */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <div className="text-2xl font-black text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                ${currentItem.price || "5555"}
              </div>
              {currentItem.original_price && (
                <div className="text-xs text-gray-500 line-through">
                  ${currentItem.original_price}
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 bg-gradient-to-r from-[#00a3ff] via-[#0066ff] to-[#00e5ff] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(0,163,255,0.4)] hover:shadow-[0_0_22px_rgba(0,229,255,0.8)] transition-all duration-300 active:scale-95">
              <ShoppingCart className="w-4 h-4" />
              <span>إضافة للسلة</span>
            </button>
          </div>

          {/* نقاط المؤشر */}
          <div className="flex items-center justify-center gap-2 pt-5">
            {itemsList.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  slide === idx
                    ? "w-8 bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                    : "w-2.5 bg-[#122347] hover:bg-[#00a3ff]/50 border border-[#1d3563]"
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
