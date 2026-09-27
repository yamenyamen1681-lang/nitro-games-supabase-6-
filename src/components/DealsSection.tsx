"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/data";
import { ShoppingBag, Flame, ShieldCheck, Zap, Heart, Eye } from "lucide-react";

interface DealsSectionProps {
  dealProducts?: Product[];
}

export const DealsSection: React.FC<DealsSectionProps> = ({ dealProducts = [] }) => {
  const { addToCart, wishlist, toggleWishlist, setQuickViewProduct } = useCart();

  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 59, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredProduct = dealProducts[0] || {
    id: "flash-1",
    title: "X82PRO HE Comic Cyber Edition",
    brand: "ATTACK SHARK",
    category: "KEYBOARDS",
    price: 5555,
    originalPrice: 55555,
    image: "/images/keyboard.png",
    rating: 5.0,
    description: "كيبورد احترافي بخصم خيالي وتصميم سايبر مع استجابة فائقة للغاية للجيمرز",
  };

  const isWishlisted = wishlist.some((id) => id === featuredProduct.id);
  const discountPercent = featuredProduct.originalPrice
    ? Math.round(((featuredProduct.originalPrice - featuredProduct.price) / featuredProduct.originalPrice) * 100)
    : 90;

  return (
    <section className="py-4">
      {/* Container */}
      <div className="relative bg-[#040814] border-2 border-[#00a3ff]/60 hover:border-[#00e5ff] rounded-3xl p-5 sm:p-8 shadow-[0_0_40px_rgba(0,163,255,0.3)] overflow-hidden transition-all duration-500">
        
        {/* Neon Lights Background */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#00a3ff]/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#0066ff]/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00a3ff_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#00a3ff]/30">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 font-black text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse">
                <Flame className="w-4 h-4 fill-red-500" />
                عروض الفلاش الأسبوعية
              </span>
              <span className="text-xs text-[#00e5ff] font-bold tracking-wide">
                NITRO FLASH DEALS
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              وفر حتى <span className="text-[#00e5ff] drop-shadow-[0_0_12px_rgba(0,229,255,0.8)]">20% إلى {discountPercent}%</span> على العتاد
            </h2>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3 bg-[#080f24] border border-[#00a3ff]/40 p-3 rounded-2xl shadow-[0_0_15px_rgba(0,163,255,0.2)] shrink-0">
            <div className="flex items-center gap-2 font-mono">
              <div className="flex flex-col items-center">
                <div className="w-11 h-10 rounded-xl bg-[#030610] border border-red-500/50 text-red-400 text-lg font-black flex items-center justify-center shadow-[inset_0_0_10px_rgba(239,68,68,0.3)]">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <span className="text-[9px] text-gray-400 font-bold mt-1">ساعة</span>
              </div>
              <span className="text-red-500 font-black text-lg -mt-3">:</span>

              <div className="flex flex-col items-center">
                <div className="w-11 h-10 rounded-xl bg-[#030610] border border-red-500/50 text-red-400 text-lg font-black flex items-center justify-center shadow-[inset_0_0_10px_rgba(239,68,68,0.3)]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <span className="text-[9px] text-gray-400 font-bold mt-1">دقيقة</span>
              </div>
              <span className="text-red-500 font-black text-lg -mt-3">:</span>

              <div className="flex flex-col items-center">
                <div className="w-11 h-10 rounded-xl bg-[#030610] border border-red-500/50 text-red-400 text-lg font-black flex items-center justify-center shadow-[inset_0_0_10px_rgba(239,68,68,0.3)] animate-pulse">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <span className="text-[9px] text-gray-400 font-bold mt-1">ثانية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Card Showcase */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mt-6">
          
          {/* Image Box */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[260px] sm:min-h-[320px] bg-gradient-to-b from-[#081026] to-[#030612] border border-[#00a3ff]/40 rounded-2xl p-6 group overflow-hidden shadow-[inset_0_0_30px_rgba(0,163,255,0.25)]">
            
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-bounce">
              %{discountPercent} خصم-
            </div>

            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(featuredProduct.id)}
                className={`p-2 rounded-xl border transition-all ${
                  isWishlisted
                    ? "bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]"
                    : "bg-[#060c1d] border-[#00a3ff]/40 text-gray-300 hover:text-red-400"
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500" : ""}`} />
              </button>
              <button
                onClick={() => setQuickViewProduct(featuredProduct)}
                className="p-2 rounded-xl bg-[#060c1d] border border-[#00a3ff]/40 text-gray-300 hover:text-[#00e5ff] transition-all"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Neon Glow behind the product */}
            <div className="absolute w-52 h-52 bg-[#00a3ff]/40 rounded-full blur-3xl group-hover:scale-125 group-hover:bg-[#00e5ff]/60 transition-all duration-700 pointer-events-none" />
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#00e5ff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

            <img
              src={featuredProduct.image}
              alt={featuredProduct.title}
              className="relative z-10 max-h-[220px] sm:max-h-[280px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] transform group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-lg bg-[#040814]/90 border border-[#00a3ff]/40 flex items-center gap-1.5 text-xs text-emerald-400 font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              متوفر حالياً
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#00e5ff] tracking-widest uppercase bg-[#00a3ff]/15 px-3 py-1 rounded-md border border-[#00a3ff]/30">
                  {featuredProduct.brand}
                </span>
                <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00e5ff]" />
                  ضمان رسمي 12 شهر
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white hover:text-[#00e5ff] transition-colors leading-tight">
                {featuredProduct.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2">
                {featuredProduct.description || "عتاد ألعاب عالي الأداء مع وقت استجابة سريع للغاية وإضاءة متجاوبة."}
              </p>
            </div>

            {/* Stock Progress Bar */}
            <div className="bg-[#080e22] border border-[#00a3ff]/30 p-3 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  المتبقي في العرض:
                </span>
                <span className="text-red-400 font-black">3 قطع فقط!</span>
              </div>
              <div className="w-full h-2.5 bg-[#030612] rounded-full overflow-hidden p-0.5 border border-[#00a3ff]/20">
                <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-[#00e5ff] rounded-full w-[85%] animate-pulse" />
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 line-through font-mono">
                  {featuredProduct.originalPrice} ₪
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white font-mono tracking-tight drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                    {featuredProduct.price}
                  </span>
                  <span className="text-sm font-bold text-[#00e5ff]">₪</span>
                </div>
              </div>

              <button
                onClick={() => addToCart(featuredProduct)}
                className="flex-1 max-w-[200px] py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#00a3ff] via-[#0080ff] to-[#00e5ff] hover:from-[#00c3ff] hover:to-[#00a3ff] text-black font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,163,255,0.6)] active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة للسلة</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
