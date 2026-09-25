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
  ShieldCheck,
  Truck,
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

  // إعدادات سلايدر الخصومات والمنتجات المباشرة المدمجة
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // العداد التنازلي للخصومات
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 45, seconds: 14 });

  // قائمة المنتجات التي تحتوي على خصومات
  const discountedProducts = React.useMemo(() => {
    const discounted = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    return discounted.length > 0 ? discounted : products.slice(0, 6);
  }, [products]);

  // تشغيل العداد التنازلي
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

  // التبديل التلقائي المباشر للخصومات
  const nextSlide = useCallback(() => {
    if (discountedProducts.length === 0) return;
    setSlideIndex((prev) => (prev + 1) % discountedProducts.length);
  }, [discountedProducts.length]);

  const prevSlide = useCallback(() => {
    if (discountedProducts.length === 0) return;
    setSlideIndex((prev) => (prev - 1 + discountedProducts.length) % discountedProducts.length);
  }, [discountedProducts.length]);

  useEffect(() => {
    if (isPaused || discountedProducts.length < 2) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 3500); // تبديل تلقائي كل 3.5 ثانية
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, discountedProducts.length]);

  const activeProduct = discountedProducts[slideIndex];

  // جلب وتشغيل ملف الصوت
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

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6 text-center">

        {/* 1. العنوان الرئيسي للمتجر */}
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

        {/* 2. البطاقة الموحدة الشاملة (LIVE SHOWCASE + الخصم والعداد التنازلي) */}
        <div 
          className="relative rounded-3xl bg-gradient-to-b from-[#0d1a2f] via-[#08101e] to-[#040812] border border-[#1b345b] p-4 sm:p-6 shadow-[0_0_30px_rgba(0,163,255,0.15)] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* شريط معلومات البطاقة العلوي */}
          <div className="flex items-center justify-between border-b border-[#162a4a] pb-3 mb-4">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#00e5ff] font-['Cairo']">
              <Flame className="w-4 h-4 text-[#00e5ff] animate-bounce" />
              <span>عروض الفلاش الأسبوعية</span>
            </div>
            <span className="text-[10px] font-bold text-[#00a3ff] font-mono" dir="ltr">
              Store Owner ⚡ YAMEN ⚡
            </span>
          </div>

          {/* العداد التنازلي التفاعلي */}
          <div className="flex justify-center mb-4" dir="ltr">
            <div className="flex items-center gap-2 bg-[#060c18] px-3.5 py-1.5 rounded-xl border border-[#142642]">
              <Clock className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span className="text-xs font-bold text-gray-300 font-['Cairo'] mr-1">ينتهي خلال:</span>
              <span className="text-sm font-black text-white font-mono">
                {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>

          {/* المنتج المعروض حالياً بالخصم المباشر */}
          {activeProduct && (
            <div className="relative space-y-3">
              {/* شارات الخصم والكمية */}
              <div className="flex items-center justify-between">
                {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price ? (
                  <span className="bg-[#00e5ff] text-[#020b17] font-black text-[11px] px-3 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_#00e5ff]">
                    <Percent className="w-3 h-3" /> خصم {Math.round(((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100)}%
                  </span>
                ) : (
                  <span className="bg-[#00a3ff]/20 text-[#00e5ff] font-bold text-[11px] px-3 py-0.5 rounded-full border border-[#00a3ff]/40">
                    عرض خاص
                  </span>
                )}

                <span className="text-[10px] font-bold text-gray-300 bg-[#12223c] px-2.5 py-0.5 rounded-full border border-[#223d6b]">
                  {slideIndex + 1} / {discountedProducts.length}
                </span>
              </div>

              {/* صورة المنتج */}
              <div className="relative h-52 sm:h-64 w-full my-2 flex items-center justify-center">
                <Image
                  key={activeProduct.id}
                  src={activeProduct.image}
                  alt={activeProduct.title}
                  fill
                  priority
                  className="object-contain p-2 transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* تفاصيل المنتج وزر الشراء */}
              <div className="border-t border-[#162a4a] pt-3 flex items-center justify-between gap-3 text-right">
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo']">
                    {activeProduct.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-base sm:text-lg font-black text-[#00e5ff] font-mono">
                      {activeProduct.price.toLocaleString()} ₪
                    </span>
                    {activeProduct.originalPrice && (
                      <span className="text-xs text-gray-400 line-through font-mono">
                        {activeProduct.originalPrice.toLocaleString()} ₪
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(activeProduct, 1)}
                  className="btn-pink text-xs px-4 py-2.5 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>أضف للسلة</span>
                </button>
              </div>

              {/* أسهم التبديل اليدوية */}
              {discountedProducts.length > 1 && (
                <div className="flex items-center justify-between absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none px-1">
                  <button
                    onClick={prevSlide}
                    className="pointer-events-auto p-2 rounded-full bg-[#050b17]/90 border border-[#1b345b] text-white hover:bg-[#00a3ff] hover:text-black transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="pointer-events-auto p-2 rounded-full bg-[#050b17]/90 border border-[#1b345b] text-white hover:bg-[#00a3ff] hover:text-black transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* نقاط المؤشر التفاعلية بالأسفل */}
          {discountedProducts.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-4">
              {discountedProducts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === slideIndex ? "w-6 bg-[#00e5ff]" : "w-1.5 bg-[#172c4d]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
