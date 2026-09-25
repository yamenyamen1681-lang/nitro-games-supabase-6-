"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Product, ShowcaseConfig, DEFAULT_SHOWCASE } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Truck,
  Zap,
  ShoppingBag,
  Flame,
  Music,
  Volume2,
  Percent,
  Clock,
  LayoutGrid,
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

  // الصوت
  const [siteAudioUrl, setSiteAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // حالة المنتجات والخصومات
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // العداد التنازلي
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 44, seconds: 43 });

  // تصفية المنتجات التي تحتوى على خصومات
  const discountedProducts = React.useMemo(() => {
    const discounted = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    return discounted.length > 0 ? discounted : products.slice(0, 5);
  }, [products]);

  // تحميل ملف الصوت
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

  // التنقل السلس بين منتجات العروض
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
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, discountedProducts.length]);

  const activeProduct = discountedProducts[slideIndex];

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

  // عناصر الشريط المتحرك الدوار
  const marqueeItems = [
    { text: "خصومات الفلاش الأسبوعية", icon: <Flame className="w-3.5 h-3.5 text-[#00e5ff]" /> },
    { text: "خصومات حصرية لفترة محدودة", icon: <Percent className="w-3.5 h-3.5 text-[#00a3ff]" /> },
    { text: "وفر حتى 20% على عتاد البطولات", icon: <Zap className="w-3.5 h-3.5 text-yellow-400" /> },
    { text: "+5,400 لاعب يثق بنا", icon: "⭐" },
    { text: "ضمان حقيقي لمدة سنة كاملة", icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> },
    { text: "شحن سريع لكافة المدن (24-48h)", icon: <Truck className="w-3.5 h-3.5 text-[#00e5ff]" /> },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-14 bg-[#03060d] border-b border-[#14233c]">
      {/* حركة الشريط الدوار المستمر */}
      <style>{`
        @keyframes marqueeSeamless {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee-continuous {
          display: flex;
          width: max-content;
          animation: marqueeSeamless 10s linear infinite;
        }
        .animate-marquee-continuous:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* خلفية نيونية إلكترونية */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[350px] bg-[#00a3ff]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
        
        {/* 1. البادج العلوي الرئيسي (من الصورة الأولى) */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0c182b] border border-[#00a3ff]/40 shadow-[0_0_15px_rgba(0,163,255,0.2)]">
            <Flame className="w-4 h-4 text-[#00e5ff] animate-bounce" />
            <span className="text-xs font-bold text-gray-200">
              عروض الفلاش الأسبوعية • خصومات حصرية لفترة محدودة
            </span>
          </div>
        </div>

        {/* 2. عنوان الخصم والتفاصيل (من الصورة الأولى) */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight font-['Cairo']">
            وفر حتى <span className="text-[#00e5ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">20%</span> على نخبة عتاد البطولات
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 font-['Cairo']">
            أسعار خاصة شاملة التوصيل لكافة مناطق فلسطين والداخل المحتل مع كفالة سنة كاملة وشحن سريع.
          </p>
        </div>

        {/* 3. العداد التنازلي (Countdown Timer) (من الصورة الأولى) */}
        <div className="flex justify-center my-4" dir="ltr">
          <div className="flex items-center gap-3 bg-[#080e1a] p-3 rounded-2xl border border-[#162947]">
            {/* ساعات */}
            <div className="flex flex-col items-center justify-center bg-[#0d182b] border border-[#1b3257] w-14 h-14 sm:w-16 sm:h-16 rounded-xl">
              <span className="text-lg sm:text-xl font-black text-white font-mono">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400 font-['Cairo']">ساعة</span>
            </div>
            <span className="text-lg font-bold text-[#00a3ff] animate-ping">:</span>
            
            {/* دقائق */}
            <div className="flex flex-col items-center justify-center bg-[#0d182b] border border-[#1b3257] w-14 h-14 sm:w-16 sm:h-16 rounded-xl">
              <span className="text-lg sm:text-xl font-black text-white font-mono">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400 font-['Cairo']">دقيقة</span>
            </div>
            <span className="text-lg font-bold text-[#00a3ff] animate-ping">:</span>

            {/* ثواني */}
            <div className="flex flex-col items-center justify-center bg-[#0d182b] border border-[#1b3257] w-14 h-14 sm:w-16 sm:h-16 rounded-xl">
              <span className="text-lg sm:text-xl font-black text-[#00e5ff] font-mono">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[10px] text-gray-400 font-['Cairo']">ثانية</span>
            </div>
          </div>
        </div>

        {/* 4. أزرار التحكم والعمليات السريعة */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => scrollTo("products")}
            className="btn-neon text-sm px-6 py-3 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,163,255,0.3)]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>تسوق الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollTo("categories")}
            className="px-5 py-3 rounded-xl bg-[#0c182b] border border-[#1b3257] text-white text-sm font-bold flex items-center gap-2 hover:border-[#00e5ff] transition-all"
          >
            <LayoutGrid className="w-4 h-4 text-[#00e5ff]" />
            <span>الأقسام الخمسة</span>
          </button>

          {siteAudioUrl && (
            <>
              <audio ref={audioRef} src={siteAudioUrl} loop />
              <button
                onClick={toggleAudio}
                className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                  isPlaying
                    ? "bg-[#00a3ff] text-black shadow-[0_0_15px_#00a3ff]"
                    : "bg-[#0c182b] border border-[#1b3257] text-[#00a3ff]"
                }`}
                title="تشغيل/إيقاف الصوت"
              >
                {isPlaying ? <Volume2 className="w-4 h-4" /> : <Music className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>

        {/* 5. بطاقة منتج الخصم والفرصة (من الصورة الأولى) */}
        {activeProduct && (
          <div 
            className="max-w-xl mx-auto relative rounded-2xl bg-gradient-to-b from-[#0e1b30] to-[#080f1e] border border-[#1d355a] p-4 shadow-2xl overflow-hidden group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* شارة الخصم والكمية */}
            <div className="flex items-center justify-between mb-2">
              {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                <div className="bg-[#00e5ff] text-[#030d1a] font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_10px_#00e5ff]">
                  <Percent className="w-3 h-3" />
                  <span>خصم {Math.round(((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100)}%</span>
                </div>
              )}

              <span className="text-[11px] font-bold text-gray-300 bg-[#12223c] px-2.5 py-0.5 rounded-full border border-[#213a63]">
                متبقي {activeProduct.inStock ?? 10} قطع
              </span>
            </div>

            {/* صورة المنتج */}
            <div className="relative h-48 sm:h-56 w-full my-2 flex items-center justify-center">
              <Image
                src={activeProduct.image}
                alt={activeProduct.title}
                fill
                priority
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* تفاصيل المنتج وزر الإضافة */}
            <div className="border-t border-[#1a2f4f] pt-3 flex items-center justify-between gap-3">
              <div className="text-right min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo']">
                  {activeProduct.title}
                </h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base font-black text-[#00e5ff] font-mono">
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
                className="btn-pink text-xs px-4 py-2.5 flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>أضف للسلة</span>
              </button>
            </div>

            {/* أسهم التنقل بين منتجات الخصم */}
            {discountedProducts.length > 1 && (
              <div className="flex items-center justify-between absolute inset-x-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <button
                  onClick={prevSlide}
                  className="pointer-events-auto p-1.5 rounded-full bg-[#070e1b]/80 border border-[#1b345b] text-white hover:bg-[#00a3ff] hover:text-black transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={nextSlide}
                  className="pointer-events-auto p-1.5 rounded-full bg-[#070e1b]/80 border border-[#1b345b] text-white hover:bg-[#00a3ff] hover:text-black transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* 6. الشريط الدوار المدمج بالأسفل (الدوران المستمر والسريع) */}
        <div className="w-full overflow-hidden pt-3 border-t border-[#13233c] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee-continuous gap-3">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0d1a2f]/80 border border-[#1b3458] shrink-0 ml-3"
              >
                {typeof item.icon === "string" ? <span>{item.icon}</span> : item.icon}
                <span className="text-xs font-bold text-gray-200 font-['Cairo'] whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
