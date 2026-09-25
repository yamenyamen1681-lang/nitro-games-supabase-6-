"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Product, ShowcaseConfig, DEFAULT_SHOWCASE, CATEGORIES_META } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  Truck,
  Zap,
  CheckCircle2,
  ShoppingBag,
  Flame,
  Music,
  Volume2,
  Percent,
  Clock,
} from "lucide-react";

interface HeroSectionProps {
  products: Product[];
  showcase?: ShowcaseConfig;
  onCategorySelect?: (cat: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  products,
  showcase,
  onCategorySelect,
}) => {
  const { addToCart } = useCart();
  const cfg = showcase ?? DEFAULT_SHOWCASE;

  // إعدادات الصوت للقسم العلوي الأصلي
  const [siteAudioUrl, setSiteAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showcaseVideoIndex, setShowcaseVideoIndex] = useState(0);
  const showcaseVideoRef = useRef<HTMLVideoElement | null>(null);

  // إعدادات سلايدر الهيرو الأصلي
  const showcaseItems = React.useMemo(() => {
    if (cfg.productIds.length > 0) {
      const picked = cfg.productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));
      if (picked.length > 0) return picked;
    }
    return products.slice(0, 6);
  }, [cfg.productIds, products]);

  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => {
      if (showcaseItems.length === 0) return;
      setSlide((s) => (s + dir + showcaseItems.length) % showcaseItems.length);
    },
    [showcaseItems.length]
  );

  useEffect(() => {
    if (!cfg.autoPlay || paused || showcaseItems.length < 2) return;
    const t = setInterval(() => go(1), Math.max(1200, cfg.intervalMs));
    return () => clearInterval(t);
  }, [cfg.autoPlay, cfg.intervalMs, paused, go, showcaseItems.length]);

  const active = showcaseItems[slide];

  // --- إعدادات قسم الخصومات المدمج الموحد ---
  const [discountIndex, setDiscountIndex] = useState(0);
  const [isDiscountPaused, setIsDiscountPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 45, seconds: 14 });

  // تصفية المنتجات التي توجد بها خصومات
  const discountedProducts = React.useMemo(() => {
    const discounted = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    return discounted.length > 0 ? discounted : products.slice(0, 5);
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

  // التبديل المباشر والتلقائي للخصم والمنتج التالي
  const nextDiscount = useCallback(() => {
    if (discountedProducts.length === 0) return;
    setDiscountIndex((prev) => (prev + 1) % discountedProducts.length);
  }, [discountedProducts.length]);

  const prevDiscount = useCallback(() => {
    if (discountedProducts.length === 0) return;
    setDiscountIndex((prev) => (prev - 1 + discountedProducts.length) % discountedProducts.length);
  }, [discountedProducts.length]);

  useEffect(() => {
    if (isDiscountPaused || discountedProducts.length < 2) return;
    const interval = setInterval(() => {
      nextDiscount();
    }, 3500); // يبدل تلقائياً للخصم التالي كل 3.5 ثانية
    return () => clearInterval(interval);
  }, [isDiscountPaused, nextDiscount, discountedProducts.length]);

  const currentDiscountProduct = discountedProducts[discountIndex];

  // تشغيل الصوت
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
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 bg-[#05070d] border-b border-[#16223a]">
      {/* خلفية نيون */}
      <div className="absolute inset-0 tech-grid opacity-50 pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-[500px] h-[350px] bg-[#00a3ff]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* ================= 1. القسم العلوي الأصلي (بدون أي تغيير) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* النص والزر الأيمن */}
          <div className="lg:col-span-6 space-y-6 text-right">
            <div className="flex items-center gap-4 justify-end">
              <div className="text-right">
                <div className="brand-mark brand-mark-lg text-white">
                  NITRO <span className="brand-mark-games">GAMES</span>
                </div>
                <div className="brand-sub mt-2">PALESTINE · ESPORTS GEAR</div>
              </div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl grad-frame flex items-center justify-center flex-shrink-0">
                <Zap className="w-8 h-8 sm:w-9 sm:h-9 text-[#00a3ff] drop-shadow-[0_0_14px_#00a3ff]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.2rem] font-black text-white leading-[1.25] font-['Cairo']">
              <span className="brand-mark brand-mark-md text-white">NITRO GAMES</span>
              <span className="block mt-2">خياركم الأفضل في فلسطين</span>
              <span className="block text-2xl sm:text-4xl lg:text-[2.5rem] text-gray-100 mt-1.5">
                للعتاد الاحترافي.. <span className="glow-cyan">ارفع مستوى لعبك!</span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-300">
              توصيل لكافة مناطق فلسطين والداخل المحتل 🚚 | ضمان حقيقي لمدة سنة على جميع المنتجات ⭐
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => scrollTo("products")}
                className="btn-neon text-sm sm:text-base px-7 py-3.5 flex items-center gap-2.5 cursor-pointer group"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>تسوق الآن</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* العرض المميز الأصلي أيسر الهيرو */}
          <div className="lg:col-span-6">
            {cfg.enabled && active ? (
              <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
                <div className="relative grad-frame p-1.5 rounded-2xl">
                  <div className="rounded-[16px] bg-[#080d18] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#16223a]">
                      <span className="text-[10px] font-tech text-[#00e5ff] flex items-center gap-1">
                        <Flame className="w-3 h-3" /> {cfg.badgeText}
                      </span>
                      <span className="text-[10px] font-bold text-[#00a3ff]" dir="ltr">
                        Store Owner ⚡ 𝓨𝓪𝓶𝓔𝓷 ⚡
                      </span>
                    </div>

                    <div className="relative h-60 sm:h-72 w-full bg-gradient-to-b from-[#0d1524] to-[#05070d]">
                      <Image src={active.image} alt={active.title} fill className="object-contain p-6" priority />
                    </div>

                    <div className="px-4 py-3 border-t border-[#16223a] flex items-center justify-between">
                      <div className="text-right">
                        <span className="text-[10px] text-[#00a3ff] font-tech">{active.brand}</span>
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate">{active.title}</h3>
                      </div>
                      <button onClick={() => addToCart(active, 1)} className="btn-pink text-xs px-3.5 py-2">
                        أضف للسلة
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* ================= 2. البطاقة الموحدة والمدمجة للخصومات والمنتج المباشر ================= */}
        <div 
          className="max-w-3xl mx-auto relative rounded-3xl p-0.5 bg-gradient-to-b from-[#00e5ff]/30 via-[#00a3ff]/15 to-[#0a1220] shadow-[0_0_40px_rgba(0,163,255,0.15)] overflow-hidden"
          onMouseEnter={() => setIsDiscountPaused(true)}
          onMouseLeave={() => setIsDiscountPaused(false)}
        >
          <div className="rounded-[23px] bg-[#070c18]/95 backdrop-blur-xl p-5 sm:p-7 space-y-6 text-center">

            {/* أ. البادج العلوي المدمج */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d182b] border border-[#00a3ff]/40 shadow-[0_0_12px_rgba(0,163,255,0.2)]">
              <Flame className="w-3.5 h-3.5 text-[#00e5ff] animate-bounce" />
              <span className="text-xs font-bold text-gray-200 font-['Cairo']">
                عروض الفلاش الأسبوعية • خصومات حصرية لفترة محدودة
              </span>
            </div>

            {/* ب. العنوان والخصم */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-white font-['Cairo'] leading-tight">
                وفر حتى <span className="text-[#00e5ff] drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">20%</span> على نخبة عتاد البطولات
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-['Cairo'] max-w-lg mx-auto">
                أسعار خاصة شاملة التوصيل لكافة مدن فلسطين والداخل المحتل مع كفالة سنة كاملة وشحن سريع.
              </p>
            </div>

            {/* ج. العداد التنازلي التفاعلي */}
            <div className="flex justify-center" dir="ltr">
              <div className="flex items-center gap-2.5 bg-[#0a1222] px-4 py-2.5 rounded-2xl border border-[#162a4a]">
                <div className="flex flex-col items-center justify-center bg-[#0e1c33] border border-[#1d3863] w-14 h-14 rounded-xl">
                  <span className="text-lg font-black text-white font-mono">{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span className="text-[9px] text-gray-400 font-['Cairo']">ساعة</span>
                </div>
                <span className="text-lg font-bold text-[#00a3ff] animate-ping">:</span>
                <div className="flex flex-col items-center justify-center bg-[#0e1c33] border border-[#1d3863] w-14 h-14 rounded-xl">
                  <span className="text-lg font-black text-white font-mono">{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span className="text-[9px] text-gray-400 font-['Cairo']">دقيقة</span>
                </div>
                <span className="text-lg font-bold text-[#00a3ff] animate-ping">:</span>
                <div className="flex flex-col items-center justify-center bg-[#0e1c33] border border-[#1d3863] w-14 h-14 rounded-xl">
                  <span className="text-lg font-black text-[#00e5ff] font-mono">{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <span className="text-[9px] text-gray-400 font-['Cairo']">ثانية</span>
                </div>
              </div>
            </div>

            {/* د. بطاقة منتج الخصم التي تتبدل مباشرة داخل الكارت الموحد */}
            {currentDiscountProduct && (
              <div className="relative rounded-2xl bg-[#0b1424] border border-[#1a2f52] p-4 text-right transition-all duration-500">
                
                <div className="flex items-center justify-between mb-2">
                  {currentDiscountProduct.originalPrice && currentDiscountProduct.originalPrice > currentDiscountProduct.price && (
                    <span className="bg-[#00e5ff] text-[#020b17] font-black text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_#00e5ff]">
                      <Percent className="w-3 h-3" /> خصم {Math.round(((currentDiscountProduct.originalPrice - currentDiscountProduct.price) / currentDiscountProduct.originalPrice) * 100)}%
                    </span>
                  )}
                  <span className="text-[10px] font-bold text-gray-300 bg-[#12223c] px-2 py-0.5 rounded-full border border-[#223d6b]">
                    متبقي {currentDiscountProduct.inStock ?? 10} قطع
                  </span>
                </div>

                {/* صورة المنتج */}
                <div className="relative h-44 sm:h-52 w-full my-2 flex items-center justify-center">
                  <Image
                    key={currentDiscountProduct.id}
                    src={currentDiscountProduct.image}
                    alt={currentDiscountProduct.title}
                    fill
                    priority
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* التفاصيل وزر الإضافة */}
                <div className="border-t border-[#182a47] pt-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo']">
                      {currentDiscountProduct.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-base font-black text-[#00e5ff] font-mono">
                        {currentDiscountProduct.price.toLocaleString()} ₪
                      </span>
                      {currentDiscountProduct.originalPrice && (
                        <span className="text-xs text-gray-400 line-through font-mono">
                          {currentDiscountProduct.originalPrice.toLocaleString()} ₪
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(currentDiscountProduct, 1)}
                    className="btn-pink text-xs px-4 py-2.5 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>أضف للسلة</span>
                  </button>
                </div>

                {/* أسهم التبديل اليدوية */}
                {discountedProducts.length > 1 && (
                  <div className="flex items-center justify-between absolute inset-x-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <button
                      onClick={prevDiscount}
                      className="pointer-events-auto p-1.5 rounded-full bg-[#070e1b]/90 border border-[#1b345b] text-white hover:bg-[#00a3ff] hover:text-black transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextDiscount}
                      className="pointer-events-auto p-1.5 rounded-full bg-[#070e1b]/90 border border-[#1b345b] text-white hover:bg-[#00a3ff] hover:text-black transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* مؤشر التبديل النقطي للخصومات */}
            {discountedProducts.length > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {discountedProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setDiscountIndex(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === discountIndex ? "w-6 bg-[#00e5ff]" : "w-1.5 bg-[#1b3257]"
                    }`}
                  />
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
