"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import { Product, ShowcaseConfig, DEFAULT_SHOWCASE } from "@/lib/data";
import { useCart } from "@/context/CartContext";

import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ShoppingBag,
  Music,
  Volume2,
  Star,
  Sparkles,
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

  const [siteAudioUrl, setSiteAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [showcaseVideoIndex, setShowcaseVideoIndex] = useState(0);
  const showcaseVideoRef = useRef<HTMLVideoElement | null>(null);

  // Autoplay handler
  useEffect(() => {
    const vid = showcaseVideoRef.current;
    if (!vid) return;

    const playPromise = vid.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [showcaseVideoIndex, cfg.videoUrls]);

  // Audio Handler
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings?key=site_audio", {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success && data.value?.url) {
          setSiteAudioUrl(data.value.url);
        }
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

  const showcaseItems = useMemo(() => {
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

      setSlide(
        (s) => (s + dir + showcaseItems.length) % showcaseItems.length
      );
    },
    [showcaseItems.length]
  );

  useEffect(() => {
    if (!cfg.autoPlay || paused || showcaseItems.length < 2) return;

    const t = setInterval(() => go(1), Math.max(1200, cfg.intervalMs));
    return () => clearInterval(t);
  }, [cfg.autoPlay, cfg.intervalMs, paused, go, showcaseItems.length]);

  useEffect(() => {
    if (slide >= showcaseItems.length) {
      setSlide(0);
    }
  }, [showcaseItems.length, slide]);

  const active = showcaseItems[slide];

  const features = [
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />,
      big: "1 سنة",
      small: "ضمان حقيقي",
      glow: "hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]",
    },
    {
      icon: <Truck className="w-4 h-4 text-[#00D9FF]" />,
      big: "24-48h",
      small: "شحن سريع جداً",
      glow: "hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]",
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-[#00A8FF]" />,
      big: "100%",
      small: "منتجات أصلية",
      glow: "hover:shadow-[0_0_20px_rgba(0,168,255,0.3)]",
    },
    {
      icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />,
      big: "+5,400",
      small: "لاعب يثق بنا",
      glow: "hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]",
    },
  ];

  return (
    <section
      id="hero"
      className="
        relative
        overflow-hidden
        pt-6
        pb-0
        mb-0
        lg:pt-12
        lg:pb-4
        bg-[#020914]
      "
    >
      <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" />

      <div className="absolute -top-24 right-1/4 w-[520px] h-[380px] bg-[#00A8FF]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[520px] h-[380px] bg-[#00D9FF]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-2">
        {/* TOP BADGE */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full panel border border-[#00A8FF]/30 backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A8FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A8FF]" />
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-gray-200">
              المتجر الأول لطرفيات الجيمينج الاحترافية في فلسطين
            </span>
            <span className="text-[9px] sm:text-[10px] font-black bg-[#00D9FF] text-[#00101c] px-2 py-0.5 rounded-full font-tech">
              CYBER ESPORTS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* RIGHT: COPY */}
          <div className="lg:col-span-6 space-y-5 text-right">
            <div className="flex items-center gap-4 justify-end">
              <div className="text-right">
                <div className="brand-mark brand-mark-lg text-white">
                  NITRO <span className="brand-mark-games">GAMES</span>
                </div>
                <div className="brand-sub mt-1">PALESTINE · ESPORTS GEAR</div>
              </div>

              <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-2xl grad-frame flex items-center justify-center flex-shrink-0">
                <Zap className="w-7 h-7 sm:w-9 sm:h-9 text-[#00A8FF] drop-shadow-[0_0_14px_#00A8FF]" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-5xl lg:text-[3.2rem] font-black text-white leading-[1.25] font-['Cairo']">
              <span className="brand-mark brand-mark-md text-white">
                NITRO GAMES
              </span>
              <span className="block mt-1">
                <span className="sr-only">نيترو قيمز —</span>
                خياركم الأفضل في فلسطين
              </span>
              <span className="block text-xl sm:text-4xl lg:text-[2.5rem] text-gray-100 mt-1">
                للعتاد الاحترافي..{" "}
                <span className="glow-cyan">ارفع مستوى لعبك!</span>
              </span>
            </h1>

            <p className="text-xs sm:text-base text-gray-300 max-w-xl leading-relaxed">
              توصيل لكافة مناطق فلسطين والداخل المحتل 🚚 | ضمان حقيقي لمدة سنة على جميع المنتجات ⭐
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo("products")}
                className="btn-neon text-xs sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 flex items-center gap-2 cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{cfg.ctaLabel || "تسوق الآن"}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* STATIC 4-CARD FEATURE ROW */}
            <div className="pt-2 overflow-x-auto no-scrollbar">
              <div className="grid grid-cols-4 gap-2 sm:gap-3 min-w-[300px]">
                {features.map((s, i) => (
                  <div
                    key={i}
                    className={`
                      relative group overflow-hidden flex flex-col items-center text-center justify-between
                      p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#081a30]/90 to-[#030d1a]/90
                      border border-[#00A8FF]/30 hover:border-[#00D9FF] transition-all duration-300
                      backdrop-blur-md ${s.glow}
                    `}
                  >
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00D9FF]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-[#00A8FF]/10 border border-[#00A8FF]/20 group-hover:bg-[#00D9FF]/20 group-hover:border-[#00D9FF]/50 transition-all duration-300 transform group-hover:scale-110">
                      {s.icon}
                    </div>

                    <div className="mt-1">
                      <span className="text-[11px] sm:text-sm font-black text-white font-tech tracking-tight block leading-tight">
                        {s.big}
                      </span>
                      <span className="text-[8px] sm:text-[11px] text-gray-300 font-medium block mt-0.5 whitespace-nowrap">
                        {s.small}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* LEFT: SHOWCASE FRAME */}
          <div className="lg:col-span-6 mt-2 lg:mt-0">
            <div className="relative group max-w-md mx-auto lg:max-w-none">
              
              {/* زر الموسيقى المطور متناسق وبدون إحداث أي مساحة مقتطعة */}
              {siteAudioUrl && (
                <>
                  <audio ref={audioRef} src={siteAudioUrl} loop />
                  <button
                    onClick={toggleAudio}
                    className={`absolute -top-2 -left-2 z-30 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border ${
                      isPlaying
                        ? "bg-[#00D9FF] border-[#00D9FF] text-[#00101c] shadow-[0_0_12px_#00D9FF]"
                        : "bg-[#05172b]/90 border-[#00D9FF]/70 text-[#00D9FF] backdrop-blur-md"
                    }`}
                    title={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
                  >
                    {isPlaying ? (
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    ) : (
                      <Music className="w-3.5 h-3.5" />
                    )}
                  </button>
                </>
              )}

              {/* الإطار الخارجي Cyber */}
              <div className="relative p-1 rounded-[24px] bg-gradient-to-b from-[#0e3256] via-[#051a30] to-[#010a17] border border-[#00D9FF]/40">
                
                {/* لمسات الحواف Cyber Corners */}
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#00D9FF] rounded-tr-[22px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#00D9FF] rounded-bl-[22px] pointer-events-none" />

                <div className="rounded-[20px] bg-[#020b18] overflow-hidden border border-[#0f3254]">
                  
                  {/* الشريط العلوي الهيدر */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#0d2e4c] bg-gradient-to-r from-[#05172b] via-[#0a2542] to-[#05172b]">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#00D9FF] animate-spin" style={{ animationDuration: '6s' }} />
                      <span className="text-[11px] font-tech font-extrabold text-[#00D9FF] tracking-wider uppercase">
                        CYBER GEAR
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#00A8FF]/10 px-2 py-0.5 rounded-full border border-[#00A8FF]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-ping" />
                      <span className="text-[9px] font-tech font-bold text-gray-200 uppercase tracking-wider">
                        {cfg.badgeText || "LIVE SHOWCASE"}
                      </span>
                    </div>
                  </div>

                  {/* منطقة المحتوى بالفيديو أو الصورة */}
                  <div className="relative aspect-[16/10] sm:h-80 w-full bg-[#010611] p-2">
                    {cfg.enabled && cfg.videoUrls && cfg.videoUrls.length > 0 ? (
                      <div className="relative w-full h-full rounded-lg overflow-hidden border border-[#00A8FF]/30">
                        <video
                          ref={showcaseVideoRef}
                          key={cfg.videoUrls[showcaseVideoIndex % cfg.videoUrls.length]}
                          src={cfg.videoUrls[showcaseVideoIndex % cfg.videoUrls.length]}
                          autoPlay
                          muted
                          loop={cfg.videoUrls.length === 1}
                          playsInline
                          controls
                          onEnded={() =>
                            setShowcaseVideoIndex((i) => (i + 1) % cfg.videoUrls!.length)
                          }
                          className="absolute inset-0 w-full h-full object-cover rounded-lg"
                        />
                        {cfg.videoUrls.length > 1 && (
                          <span className="absolute top-2 right-2 z-10 text-[9px] font-tech bg-black/80 text-[#00D9FF] px-2 py-0.5 rounded border border-[#00D9FF]/40">
                            {(showcaseVideoIndex % cfg.videoUrls.length) + 1}/{cfg.videoUrls.length}
                          </span>
                        )}
                      </div>
                    ) : cfg.enabled && active ? (
                      <div
                        className="relative w-full h-full rounded-lg overflow-hidden border border-[#00A8FF]/30 flex items-center justify-center bg-[#020b18]"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                      >
                        <Image
                          src={active.image}
                          alt={active.title}
                          fill
                          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                          priority
                        />

                        {/* مؤشرات الصور */}
                        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-[#00A8FF]/30">
                          {showcaseItems.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setSlide(i)}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                i === slide ? "w-4 bg-[#00D9FF]" : "w-1.5 bg-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* الشريط السفلي للإطار */}
                  <div className="px-3.5 py-2.5 border-t border-[#0d2e4c] bg-gradient-to-r from-[#05172b] via-[#09223c] to-[#05172b] flex items-center justify-between gap-3">
                    <div className="text-right truncate">
                      <h3 className="text-xs font-bold text-white truncate font-['Cairo']">
                        {cfg.videoUrls && cfg.videoUrls.length > 0
                          ? cfg.headline
                          : active?.title || cfg.headline}
                      </h3>
                      {active && (!cfg.videoUrls || cfg.videoUrls.length === 0) && (
                        <p className="text-xs font-black text-[#00D9FF] font-tech mt-0.5">
                          {active.price} ₪
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        active && (!cfg.videoUrls || cfg.videoUrls.length === 0)
                          ? addToCart(active)
                          : scrollTo("products")
                      }
                      className="btn-neon text-xs px-3 py-1.5 flex items-center gap-1.5 cursor-pointer whitespace-nowrap font-bold rounded-lg"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{cfg.ctaLabel || "تسوق الآن"}</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
