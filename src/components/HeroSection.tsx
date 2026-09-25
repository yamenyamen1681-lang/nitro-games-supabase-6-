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
}) => {
  const { addToCart } = useCart();
  const cfg = showcase ?? DEFAULT_SHOWCASE;

  // Audio setup
  const [siteAudioUrl, setSiteAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Discount / Flash sale slider state
  const [slideIndex, setSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Timer state for Countdown
  const [timeLeft, setTimeLeft] = useState({ hours: 18, minutes: 44, seconds: 43 });

  // Filter products that have discounts
  const discountedProducts = React.useMemo(() => {
    const discounted = products.filter((p) => p.originalPrice && p.originalPrice > p.price);
    return discounted.length > 0 ? discounted : products.slice(0, 5);
  }, [products]);

  // Audio loading
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

  // Timer Countdown Logic
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

  // Slider auto-switch
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

  // Ticker items for infinite marquee
  const discountBadges = [
    { text: "خصومات الفلاش الأسبوعية", icon: <Flame className="w-3.5 h-3.5 text-[#00e5ff]" /> },
    { text: "خصومات حصرية لفترة محدودة", icon: <Percent className="w-3.5 h-3.5 text-[#00a3ff]" /> },
    { text: "وفر حتى 20% على عتاد البطولات", icon: <Zap className="w-3.5 h-3.5 text-yellow-400" /> },
    { text: "ضمان حقيقي لمدة سنة كاملة", icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> },
    { text: "شحن سريع لكافة المدن (24-48h)", icon: <Truck className="w-3.5 h-3.5 text-[#00e5ff]" /> },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-20 bg-[#03060d] border-b border-[#14233c]">
      {/* CSS Animation for Seamless Marquee Loop */}
      <style>{`
        @keyframes marqueeSeamless {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee-continuous {
          display: flex;
          width: max-content;
          animation: marqueeSeamless 12s linear infinite;
        }
        .animate-marquee-continuous:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Cyber Background Accents */}
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/3 w-[600px] h-[400px] bg-[#00a3ff]/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[350px] bg-[#00e5ff]/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* --- MAIN HERO CARD CONTAINER (Unified Box Design) --- */}
        <div 
          className="relative rounded-3xl p-0.5 bg-gradient-to-b from-[#00e5ff]/40 via-[#00a3ff]/10 to-[#101b2f] shadow-[0_0_50px_rgba(0,163,255,0.15)] overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="rounded-[23px] bg-[#070b14]/95 backdrop-blur-xl p-6 sm:p-8 lg:p-10 space-y-8">

            {/* Top Bar / Header Inside Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#162947]/60 pb-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0c182b] border border-[#00a3ff]/40 shadow-[0_0_15px_rgba(0,163,255,0.2)]">
                <Flame className="w-4 h-4 text-[#00e5ff] animate-bounce" />
                <span className="text-xs font-bold text-gray-200">
                  عروض الفلاش الأسبوعية • خصومات حصرية لفترة محدودة
                </span>
              </div>

              {/* Store Mark & Audio Control */}
              <div className="flex items-center gap-3">
                {siteAudioUrl && (
                  <>
                    <audio ref={audioRef} src={siteAudioUrl} loop />
                    <button
                      onClick={toggleAudio}
                      className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                        isPlaying
                          ? "bg-[#00a3ff] text-black shadow-[0_0_15px_#00a3ff]"
                          : "bg-[#0c182b] border border-[#00a3ff]/40 text-[#00a3ff]"
                      }`}
                      title="تشغيل/إيقاف الصوت"
                    >
                      {isPlaying ? <Volume2 className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                    </button>
                  </>
                )}
                <span className="text-xs font-black bg-[#00e5ff] text-[#02121f] px-3 py-1 rounded-full font-tech tracking-wider">
                  NITRO FLASH
                </span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              {/* LEFT: Discount Titles & Countdown Timer */}
              <div className="lg:col-span-6 space-y-6 text-right">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-['Cairo']">
                  وفر حتى <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] to-[#00a3ff] drop-shadow-[0_0_20px_rgba(0,229,255,0.4)]">20%</span> على نخبة عتاد البطولات
                </h1>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg font-['Cairo']">
                  أسعار خاصة شاملة التوصيل لكافة مدن فلسطين والداخل المحتل مع كفالة سنة كاملة وشحن سريع.
                </p>

                {/* Countdown Timer Block */}
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold text-[#00e5ff]">
                    <Clock className="w-4 h-4" />
                    <span>ينتهي العرض خلال:</span>
                  </div>
                  
                  <div className="flex items-center justify-start gap-3" dir="ltr">
                    {/* Hours */}
                    <div className="flex flex-col items-center justify-center bg-[#0d182b] border border-[#1b3257] w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-[inset_0_0_15px_rgba(0,163,255,0.2)]">
                      <span className="text-xl sm:text-2xl font-black text-white font-mono">
                        {String(timeLeft.hours).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-gray-400 font-['Cairo']">ساعة</span>
                    </div>
                    <span className="text-xl font-bold text-[#00a3ff] animate-ping">:</span>
                    
                    {/* Minutes */}
                    <div className="flex flex-col items-center justify-center bg-[#0d182b] border border-[#1b3257] w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-[inset_0_0_15px_rgba(0,163,255,0.2)]">
                      <span className="text-xl sm:text-2xl font-black text-white font-mono">
                        {String(timeLeft.minutes).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-gray-400 font-['Cairo']">دقيقة</span>
                    </div>
                    <span className="text-xl font-bold text-[#00a3ff] animate-ping">:</span>

                    {/* Seconds */}
                    <div className="flex flex-col items-center justify-center bg-[#0d182b] border border-[#1b3257] w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shadow-[inset_0_0_15px_rgba(0,163,255,0.2)]">
                      <span className="text-xl sm:text-2xl font-black text-[#00e5ff] font-mono">
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-gray-400 font-['Cairo']">ثانية</span>
                    </div>
                  </div>
                </div>

                {/* Call To Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => scrollTo("products")}
                    className="btn-neon text-sm px-8 py-3.5 flex items-center gap-3 cursor-pointer group shadow-[0_0_25px_rgba(0,163,255,0.4)]"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>تسوق عروض الفلاش الآن</span>
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* RIGHT: Active Discounted Product Box */}
              <div className="lg:col-span-6">
                {activeProduct && (
                  <div className="relative rounded-2xl bg-gradient-to-b from-[#0e1b30] to-[#080f1e] border border-[#1d355a] p-5 shadow-2xl overflow-hidden group">
                    
                    {/* Product Top Bar badges */}
                    <div className="flex items-center justify-between mb-3 z-10 relative">
                      {/* Discount Badge */}
                      {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                        <div className="bg-[#00e5ff] text-[#030d1a] font-black text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_0_12px_#00e5ff]">
                          <Percent className="w-3.5 h-3.5" />
                          <span> خصم {Math.round(((activeProduct.originalPrice - activeProduct.price) / activeProduct.originalPrice) * 100)}%</span>
                        </div>
                      )}

                      <span className="text-[11px] font-bold text-gray-300 bg-[#12223c] px-3 py-1 rounded-full border border-[#213a63]">
                        متوفر {activeProduct.inStock ?? 10} قطع
                      </span>
                    </div>

                    {/* Image Area */}
                    <div className="relative h-56 sm:h-64 w-full my-2 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[#00a3ff]/5 rounded-xl blur-xl group-hover:bg-[#00e5ff]/10 transition-colors" />
                      <Image
                        src={activeProduct.image}
                        alt={activeProduct.title}
                        fill
                        priority
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Product Bottom Info & Actions */}
                    <div className="border-t border-[#1a2f4f] pt-4 mt-2 flex items-center justify-between gap-4 relative z-10">
                      <div className="text-right min-w-0">
                        <span className="text-[10px] font-tech text-[#00a3ff] uppercase tracking-wider block">
                          {activeProduct.brand}
                        </span>
                        <h3 className="text-sm sm:text-base font-bold text-white truncate font-['Cairo']">
                          {activeProduct.title}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-lg font-black text-[#00e5ff] font-mono">
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
                        className="btn-pink text-xs px-4 py-3 flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 shadow-[0_0_15px_rgba(255,0,128,0.3)]"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>أضف للسلة</span>
                      </button>
                    </div>

                    {/* Navigation Arrows for Products */}
                    {discountedProducts.length > 1 && (
                      <div className="flex items-center justify-between absolute inset-x-2 top-1/2 -translate-y-1/2 pointer-events-none z-20">
                        <button
                          onClick={prevSlide}
                          className="pointer-events-auto p-2 rounded-full bg-[#070e1b]/80 border border-[#1b345b] text-white hover:bg-[#00a3ff] hover:text-black transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={nextSlide}
                          className="pointer-events-auto p-2 rounded-full bg-[#070e1b]/80 border border-[#1b345b] text-white hover:bg-[#00a3ff] hover:text-black transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* --- INFINITE CYCLING DISCOUNT BAR (الشريط الدوار التلقائي) --- */}
            <div className="w-full overflow-hidden pt-4 border-t border-[#13233c] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="animate-marquee-continuous gap-4">
                {[...discountBadges, ...discountBadges, ...discountBadges, ...discountBadges].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0d1a2f]/80 border border-[#1b3458] hover:border-[#00e5ff]/50 shrink-0 ml-4 transition-all"
                  >
                    {item.icon}
                    <span className="text-xs font-bold text-gray-200 font-['Cairo'] whitespace-nowrap">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
