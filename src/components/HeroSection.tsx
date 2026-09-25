"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Product, ShowcaseConfig, DEFAULT_SHOWCASE } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Flame,
  Music,
  Volume2,
  Percent,
  Clock,
  Zap,
} from "lucide-react";

interface HeroSectionProps {
  products: Product[];
  showcase?: ShowcaseConfig;
  onCategorySelect?: (cat: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  products,
  showcase,
}) => {
  const { addToCart } = useCart();
  const cfg = showcase ?? DEFAULT_SHOWCASE;

  // إعدادات الصوت
  const [siteAudioUrl, setSiteAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // إعدادات العداد التنازلي
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 45, seconds: 24 });

  // قائمة المنتجات المخفضة
  const discountedProducts = React.useMemo(() => {
    const discounted = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    return discounted.length > 0 ? discounted : products.slice(0, 4);
  }, [products]);

  // العداد التنازلي
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

  // تشغيل ملف الصوت
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings?key=site_audio", { cache: "no-store" });
        const data = await res.json();
        if (data.success && data.value?.url) setSiteAudioUrl(data.value.url);
      } catch (err) {
        console.warn("Failed to load site audio:", err);
      }
    })();
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-12 bg-[#03060d] border-b border-[#14233c]">
      {/* خلفية إلكترونية */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[350px] bg-[#00a3ff]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10 space-y-6 text-center">

        {/* 1. الهيدر الرئيسي والعنوان */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo']">
            خياركم الأفضل في <span className="text-[#00e5ff]">فلسطين</span>
            <span className="block text-xl sm:text-3xl text-gray-200 mt-1">
              للعتاد الاحترافي.. <span className="glow-cyan">ارفع مستوى لعبك!</span>
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 font-['Cairo']">
            توصيل لكافة مناطق فلسطين والداخل المحتل 🚚 | ضمان حقيقي لمدة سنة ⭐
          </p>

          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => scrollTo("products")}
              className="btn-neon text-xs sm:text-sm px-6 py-2.5 flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>تسوق الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            {siteAudioUrl && (
              <>
                <audio ref={audioRef} src={siteAudioUrl} loop />
                <button
                  onClick={toggleAudio}
                  className={`p-2.5 rounded-xl transition-all ${
                    isPlaying
                      ? "bg-[#00a3ff] text-black shadow-[0_0_12px_#00a3ff]"
                      : "bg-[#0c182b] border border-[#1b3257] text-[#00a3ff]"
                  }`}
                  title="تشغيل/إيقاف الصوت"
                >
                  {isPlaying ? <Volume2 className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 2. الإطار الموحد المربوط بالكامل (العرض المباشر + بنر الخصم والمنتجات) */}
        <div className="rounded-3xl bg-[#070d1a] border border-[#1b345b] p-3 sm:p-5 shadow-[0_0_30px_rgba(0,163,255,0.12)] space-y-4">
          
          {/* أ. شريط البنار العلوي للخصومات والعداد التنازلي */}
          <div className="rounded-2xl bg-gradient-to-r from-[#0d1e38] via-[#091528] to-[#0d1e38] border border-[#1c3862] p-4 text-right flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#00e5ff] font-['Cairo']">
                <Flame className="w-4 h-4 animate-bounce" />
                <span>عروض الفلاش الأسبوعية • خصومات حصرية لفترة محدودة</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-white font-['Cairo']">
                وفر حتى <span className="text-[#00e5ff]">20%</span> على نخبة عتاد البطولات
              </h2>
            </div>

            {/* العداد التنازلي */}
            <div className="flex items-center gap-2 bg-[#050a14] px-3.5 py-2 rounded-xl border border-[#172c4a]" dir="ltr">
              <div className="text-center px-1.5">
                <span className="text-sm font-black text-white font-mono">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="block text-[8px] text-gray-400 font-['Cairo']">ساعة</span>
              </div>
              <span className="text-xs text-[#00a3ff] font-bold">:</span>
              <div className="text-center px-1.5">
                <span className="text-sm font-black text-white font-mono">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="block text-[8px] text-gray-400 font-['Cairo']">دقيقة</span>
              </div>
              <span className="text-xs text-[#00a3ff] font-bold">:</span>
              <div className="text-center px-1.5">
                <span className="text-sm font-black text-[#00e5ff] font-mono">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="block text-[8px] text-gray-400 font-['Cairo']">ثانية</span>
              </div>
            </div>
          </div>

          {/* ب. شبكة المنتجات المخفضة المربوطة المباشرة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discountedProducts.slice(0, 2).map((prod) => (
              <div
                key={prod.id}
                className="relative rounded-2xl bg-[#091120] border border-[#182d4d] p-3 text-right hover:border-[#00e5ff]/50 transition-all group"
              >
                {/* شارة الخصم والكمية */}
                <div className="flex items-center justify-between mb-1">
                  {prod.originalPrice && (
                    <span className="bg-[#00e5ff] text-[#020b17] font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Percent className="w-2.5 h-2.5" />
                       خصم {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}%
                    </span>
                  )}
                  <span className="text-[9px] font-bold text-gray-300 bg-[#12223c] px-2 py-0.5 rounded-full">
                    متبقي {prod.inStock ?? 8} قطع
                  </span>
                </div>

                {/* صورة المنتج */}
                <div className="relative h-36 sm:h-40 w-full my-1 flex items-center justify-center">
                  <Image
                    src={prod.image}
                    alt={prod.title}
                    fill
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* تفاصيل المنتج وزر الشراء */}
                <div className="border-t border-[#152744] pt-2.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-white truncate font-['Cairo']">
                      {prod.title}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-sm font-black text-[#00e5ff] font-mono">
                        {prod.price.toLocaleString()} ₪
                      </span>
                      {prod.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through font-mono">
                          {prod.originalPrice.toLocaleString()} ₪
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="btn-pink text-[11px] px-3 py-2 flex items-center gap-1 shrink-0"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>أضف للسلة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
