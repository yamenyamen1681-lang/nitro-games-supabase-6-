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
  Volume2,
  VolumeX,
  Crown,
  Radio,
  Sparkles,
  Music,
  Disc,
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

  useEffect(() => {
    const vid = showcaseVideoRef.current;
    if (!vid) return;
    const playPromise = vid.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [showcaseVideoIndex, cfg.videoUrls]);

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

  useEffect(() => {
    if (slide >= showcaseItems.length) setSlide(0);
  }, [showcaseItems.length, slide]);

  const active = showcaseItems[slide];

  const stats = [
    { icon: <span className="text-[#d4af37]">⭐</span>, big: "+5,400", small: "لاعب يثق بنا" },
    { icon: <ShieldCheck className="w-4 h-4 text-[#f4d576]" />, big: "1 سنة", small: "ضمان حقيقي" },
    { icon: <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />, big: "100%", small: "أصلي معتمد" },
    { icon: <Truck className="w-4 h-4 text-[#f4d576]" />, bg: "24-48h", small: "شحن سريع" },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-16 pb-24 lg:pt-20 lg:pb-32 bg-[#080603] border-b border-[#3a2f16]">
      <style>{`
        @keyframes marqueeLoop {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marqueeLoop 32s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
        @keyframes cyberGlow {
          0%, 100% { opacity: 0.45; filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.35)); }
          50% { opacity: 0.85; filter: drop-shadow(0 0 25px rgba(244, 213, 118, 0.6)); }
        }
        .animate-cyber-glow {
          animation: cyberGlow 5s infinite ease-in-out;
        }
        @keyframes shimmerSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-gold {
          background-size: 200% auto;
          animation: shimmerSweep 4.5s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-[520px] h-[380px] bg-[#d4af37]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[520px] h-[380px] bg-[#f4d576]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top badge — thin outline instead of a solid block, calmer */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#d4af37]/25 bg-transparent">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]" />
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide">
              المتجر الأول لطرفيات الجيمينج الاحترافية في فلسطين
            </span>
            <span className="text-[10px] font-bold text-[#f4d576] border border-[#f4d576]/40 px-2 py-0.5 rounded-full font-tech">
              CYBER ESPORTS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          {/* --- RIGHT: Copy & Store Owner Banner --- */}
          <div className="lg:col-span-6 space-y-8 text-right">
            <div className="flex items-center gap-4 justify-end">
              <div className="text-right">
                <div className="brand-mark brand-mark-lg text-white">
                  NITRO{" "}
                  <span
                    className="brand-mark-games shimmer-gold"
                    style={{
                      backgroundImage:
                        "linear-gradient(100deg, #d4af37 0%, #f4d576 25%, #fff6d8 50%, #f4d576 75%, #d4af37 100%)",
                    }}
                  >
                    GAMES
                  </span>
                </div>
                <div className="brand-sub mt-2">PALESTINE · ESPORTS GEAR</div>
              </div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl grad-frame flex items-center justify-center flex-shrink-0">
                <Zap className="w-8 h-8 sm:w-9 sm:h-9 text-[#d4af37] drop-shadow-[0_0_14px_#d4af37]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.2rem] font-light text-white leading-[1.3] font-['Cairo']">
              <span className="brand-mark brand-mark-md text-white font-normal">NITRO GAMES</span>
              <span className="block mt-3 font-black">
                <span className="sr-only">نيترو قيمز — </span>خياركم الأفضل في فلسطين
              </span>
              <span className="block text-2xl sm:text-4xl lg:text-[2.5rem] text-gray-200 mt-2 font-light">
                للعتاد الاحترافي.. <span className="glow-cyan font-bold">ارفع مستوى لعبك!</span>
              </span>
            </h1>

            {/* الأزرار + شارة صاحب المتجر */}
            <div className="flex flex-wrap items-center justify-end gap-3.5 pt-2">
              {/* شارة صاحب المتجر */}
              <div dir="ltr" className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0d0a05] via-[#1a140a] to-[#0d0a05] border border-[#d4af37]/50 shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                <Crown className="w-4 h-4 text-[#d4af37] fill-[#d4af37]/30" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                  STORE OWNER:
                </span>
                <span className="text-sm font-black text-[#f4d576] tracking-widest drop-shadow-[0_0_12px_rgba(244,213,118,0.7)] font-mono">
                  YamEn
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              </div>

              {/* زر تسوق الآن */}
              <button
                onClick={() => scrollTo("products")}
                className="btn-neon text-sm sm:text-base px-6 py-2.5 flex items-center gap-2 cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cfg.ctaLabel || "تسوق الآن"}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* الشريط المتحرك المتصل بدون انقطاع — أبطأ وأهدأ */}
            <div className="w-full overflow-hidden pt-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="animate-marquee-infinite gap-3.5">
                {[...stats, ...stats, ...stats, ...stats].map((s, i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden bg-[#0d0a05]/90 backdrop-blur-md border border-[#3a2f16] hover:border-[#f4d576]/60 rounded-xl px-4 py-2.5 text-right flex items-center gap-3 shrink-0 ml-3 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                  >
                    <div className="text-base font-black text-white font-tech flex items-center gap-2 relative z-10">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4d576] opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d4af37]" />
                      </span>
                      {s.big} {s.icon}
                    </div>
                    <div className="text-[11px] text-gray-300 font-medium font-['Cairo'] relative z-10 border-r border-[#3a2f16] pr-3">
                      {s.small}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- LEFT: Dynamic Showcase --- */}
          <div className="lg:col-span-6 space-y-4">
            {cfg.enabled && cfg.videoUrls && cfg.videoUrls.length > 0 ? (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37] via-[#f4d576] to-[#8a6d1f] rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-300 animate-cyber-glow" />

                <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-[#f4d576]/50 via-[#d4af37]/25 to-[#1a140a]/80 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                  <div className="rounded-[22px] bg-[#0a0704] overflow-hidden">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a2f16] bg-gradient-to-r from-[#0d0a05] via-[#1a140a] to-[#0d0a05]">

                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#d4af37] to-[#f4d576] text-black border-[#f4d576] shadow-[0_0_20px_rgba(244,213,118,0.6)] scale-105"
                              : "bg-[#120e08] border-[#d4af37]/40 text-[#f4d576] hover:border-[#f4d576]"
                          }`}
                          title={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
                        >
                          {isPlaying ? (
                            <>
                              <Disc className="w-4 h-4 animate-spin text-black" />
                              <Volume2 className="w-4 h-4 text-black animate-pulse" />
                            </>
                          ) : (
                            <>
                              <Music className="w-4 h-4 text-[#f4d576]" />
                              <VolumeX className="w-4 h-4 text-[#f4d576]" />
                            </>
                          )}
                        </button>
                      ) : <div />}

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tech font-black text-[#f4d576] flex items-center gap-1.5 bg-[#120e08] px-3 py-1 rounded-lg border border-[#f4d576]/30 shadow-[inset_0_0_10px_rgba(244,213,118,0.15)]">
                          <Radio className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" /> {cfg.badgeText}
                        </span>
                      </div>
                    </div>

                    <div className="relative h-60 sm:h-72 w-full bg-black p-2">
                      <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#3a2f16]">
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
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />
                        {cfg.videoUrls.length > 1 && (
                          <span className="absolute top-3 left-3 z-10 text-[10px] font-tech bg-black/80 text-[#f4d576] px-2.5 py-1 rounded-md border border-[#f4d576]/40 backdrop-blur-md">
                            {(showcaseVideoIndex % cfg.videoUrls.length) + 1} / {cfg.videoUrls.length}
                          </span>
                        )}
                        <span className="absolute inset-0 ring-1 ring-inset ring-[#d4af37]/35 rounded-xl pointer-events-none shadow-[inset_0_0_30px_rgba(212,175,55,0.25)]" />
                      </div>
                    </div>

                    <div className="px-5 py-3.5 border-t border-[#3a2f16] bg-[#0d0a05] flex items-center justify-between gap-3">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo'] tracking-wide">
                        {cfg.headline}
                      </h3>
                      <a
                        href="#products"
                        className="btn-pink text-[11px] px-4 py-2 flex items-center gap-2 cursor-pointer whitespace-nowrap rounded-xl shadow-[0_0_15px_rgba(244,213,118,0.3)]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{cfg.ctaLabel}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {siteAudioUrl && <audio ref={audioRef} src={siteAudioUrl} loop />}
              </div>
            ) : cfg.enabled && active ? (
              <div
                className="relative group"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37] via-[#f4d576] to-[#8a6d1f] rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-1000 group-hover:duration-300 animate-cyber-glow" />

                <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-[#f4d576]/50 via-[#d4af37]/25 to-[#1a140a]/80 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                  <div className="rounded-[22px] bg-[#0a0704] overflow-hidden">

                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#3a2f16] bg-gradient-to-r from-[#0d0a05] via-[#1a140a] to-[#0d0a05]">

                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#d4af37] to-[#f4d576] text-black border-[#f4d576] shadow-[0_0_20px_rgba(244,213,118,0.6)] scale-105"
                              : "bg-[#120e08] border-[#d4af37]/40 text-[#f4d576] hover:border-[#f4d576]"
                          }`}
                          title={isPlaying ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
                        >
                          {isPlaying ? (
                            <>
                              <Disc className="w-4 h-4 animate-spin text-black" />
                              <Volume2 className="w-4 h-4 text-black animate-pulse" />
                            </>
                          ) : (
                            <>
                              <Music className="w-4 h-4 text-[#f4d576]" />
                              <VolumeX className="w-4 h-4 text-[#f4d576]" />
                            </>
                          )}
                        </button>
                      ) : <div />}

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tech font-black text-[#f4d576] flex items-center gap-1.5 bg-[#120e08] px-3 py-1 rounded-lg border border-[#f4d576]/30 shadow-[inset_0_0_10px_rgba(244,213,118,0.15)]">
                          <Flame className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37] animate-pulse" /> {cfg.badgeText}
                        </span>

                        <div className="flex items-center gap-1.5 mr-2">
                          <button
                            onClick={() => go(-1)}
                            className="p-1.5 rounded-lg bg-[#120e08] hover:bg-[#d4af37] hover:text-black text-gray-200 transition-colors cursor-pointer border border-[#3a2f16]"
                            aria-label="السابق"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => go(1)}
                            className="p-1.5 rounded-lg bg-[#120e08] hover:bg-[#d4af37] hover:text-black text-gray-200 transition-colors cursor-pointer border border-[#3a2f16]"
                            aria-label="التالي"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-60 sm:h-72 w-full bg-gradient-to-b from-[#120e08] via-[#0a0704] to-[#050402]">
                      <div key={active.id} className="absolute inset-0 showcase-enter">
                        <Image
                          src={active.image}
                          alt={active.title}
                          fill
                          priority
                          className="object-contain p-5 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                        />
                      </div>

                      <span className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#f4d576] rounded-tr-lg" />
                      <span className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] rounded-bl-lg" />

                      <div className="absolute top-4 left-4 flex flex-col items-start gap-1">
                        {active.originalPrice && (
                          <span className="text-[11px] font-mono text-gray-400 line-through bg-black/70 px-2 py-0.5 rounded-md">
                            {active.originalPrice.toLocaleString()} ₪
                          </span>
                        )}
                        <span className="text-base font-black font-mono text-[#1a1000] bg-gradient-to-r from-[#d4af37] to-[#f4d576] px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                          {active.price.toLocaleString()} ₪
                        </span>
                      </div>

                      <span className="absolute bottom-4 right-4 text-[10px] font-bold font-tech text-[#f4d576] bg-[#0d0a05]/90 border border-[#f4d576]/50 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(244,213,118,0.25)]">
                        {CATEGORIES_META.find((c) => c.id === active.category)?.name ?? active.category}
                      </span>
                    </div>

                    <div className="px-5 py-3.5 border-t border-[#3a2f16] bg-[#0d0a05] flex items-center justify-between gap-3">
                      <div className="min-w-0 text-right">
                        <div className="text-[10px] font-tech text-[#d4af37] uppercase tracking-wider">{active.brand}</div>
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo']">
                          {active.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => addToCart(active, 1)}
                        className="btn-pink text-[11px] px-4 py-2 flex items-center gap-2 cursor-pointer whitespace-nowrap rounded-xl shadow-[0_0_15px_rgba(244,213,118,0.3)]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>أضف للسلة</span>
                      </button>
                    </div>
                  </div>
                </div>

                {siteAudioUrl && <audio ref={audioRef} src={siteAudioUrl} loop />}
              </div>
            ) : (
              <div className="panel rounded-2xl h-56 flex flex-col items-center justify-center gap-3 text-center border border-[#3a2f16]">
                <Zap className="w-10 h-10 text-[#d4af37]/40" />
                <p className="text-xs text-gray-400">المربع المميز معطّل حالياً من لوحة التحكم</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
