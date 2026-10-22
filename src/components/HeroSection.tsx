
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Product,
  ShowcaseConfig,
  DEFAULT_SHOWCASE,
  CATEGORIES_META,
} from "@/lib/data";
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
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/settings?key=site_audio", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!cancelled && data.success && data.value?.url) {
          setSiteAudioUrl(data.value.url);
        }
      } catch (err) {
        console.warn("Failed to load site audio:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
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
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
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

      setSlide(
        (s) => (s + dir + showcaseItems.length) % showcaseItems.length
      );
    },
    [showcaseItems.length]
  );

  useEffect(() => {
    if (!cfg.autoPlay || paused || showcaseItems.length < 2) return;

    const t = setInterval(
      () => go(1),
      Math.max(1200, cfg.intervalMs)
    );

    return () => clearInterval(t);
  }, [cfg.autoPlay, cfg.intervalMs, paused, go, showcaseItems.length]);

  useEffect(() => {
    if (slide >= showcaseItems.length) setSlide(0);
  }, [showcaseItems.length, slide]);

  const active = showcaseItems[slide];

  const stats = [
    {
      icon: <span className="text-[#00a3ff]">⭐</span>,
      big: "+5,400",
      small: "لاعب يثق بنا",
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />,
      big: "1 سنة",
      small: "ضمان حقيقي",
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-[#00a3ff]" />,
      big: "100%",
      small: "أصلي معتمد",
    },
    {
      icon: <Truck className="w-4 h-4 text-[#00e5ff]" />,
      big: "24-48h",
      small: "شحن سريع",
    },
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-4 pb-20 lg:pt-6 lg:pb-28 bg-[#03060f] border-b border-[#16223a]"
    >
      <style>{`
        /* ========================================
           NITRO GAMES — PREMIUM NEON BANNER
        ======================================== */

        .nitro-price-banner {
          isolation: isolate;
          position: relative;
          border-radius: 18px;
          background: #030916;
          box-shadow:
            0 0 25px rgba(0, 110, 255, 0.13),
            0 12px 35px rgba(0, 0, 0, 0.32);
        }

        .nitro-price-inner {
          position: relative;
          isolation: isolate;
          min-height: 155px;
          overflow: hidden;
          border: 1px solid rgba(27, 142, 255, 0.38);
          border-radius: 18px;
          background:
            radial-gradient(
              ellipse at 50% 15%,
              rgba(0, 115, 255, 0.17),
              transparent 65%
            ),
            linear-gradient(
              145deg,
              #050d1b 0%,
              #07152a 48%,
              #030916 100%
            );
        }

        .nitro-price-inner::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            135deg,
            transparent 0,
            transparent 30px,
            rgba(38, 126, 255, 0.025) 31px,
            transparent 32px
          );
          z-index: -1;
        }

        .nitro-price-brand {
          font-family: Arial, Helvetica, sans-serif;
          font-style: italic;
          font-weight: 950;
          line-height: 0.85;
          letter-spacing: 0.24em;
          text-shadow:
            0 0 8px rgba(0, 132, 255, 0.25),
            0 0 24px rgba(0, 132, 255, 0.12);
        }

        .nitro-price-word {
          background: linear-gradient(
            100deg,
            #ffffff 0%,
            #e8f5ff 40%,
            #ffffff 55%,
            #b8e8ff 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .nitro-games-word {
          background: linear-gradient(
            100deg,
            #168bff 0%,
            #51e7ff 45%,
            #d8f8ff 50%,
            #14a0ff 75%,
            #087cff 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 220% auto;
          animation: nitro-brand-shimmer 5s linear infinite;
        }

        @keyframes nitro-brand-shimmer {
          from { background-position: 100% center; }
          to { background-position: -120% center; }
        }

        .nitro-price-heading {
          font-family: "Cairo", Arial, sans-serif;
          font-weight: 900;
          letter-spacing: -0.035em;
          text-shadow: 0 0 18px rgba(0, 132, 255, 0.2);
        }

        .nitro-price-separator {
          position: relative;
          height: 1px;
          width: min(250px, 72%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 130, 255, 0.75),
            rgba(70, 226, 255, 0.9),
            rgba(0, 130, 255, 0.75),
            transparent
          );
        }

        .nitro-price-separator::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 44px;
          height: 3px;
          border-radius: 99px;
          transform: translate(-50%, -50%);
          background: #38dfff;
          box-shadow:
            0 0 7px #168bff,
            0 0 16px rgba(0, 170, 255, 0.8);
        }

        /* خطّان يقتربان من بعض ثم يعكسان اتجاههما */
        .nitro-collision-track {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          overflow: hidden;
          pointer-events: none;
        }

        .nitro-collision-track-top {
          top: 0;
        }

        .nitro-collision-track-bottom {
          bottom: 0;
        }

        .nitro-collision-line {
          position: absolute;
          top: 0;
          width: 42%;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #087cff 15%,
            #48eaff 50%,
            #087cff 85%,
            transparent 100%
          );
          box-shadow:
            0 0 7px #168bff,
            0 0 15px rgba(0, 170, 255, 0.85);
          will-change: left, right;
        }

        .nitro-collision-line-top {
          left: 0;
          animation: nitro-top-collision 2.6s
            cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
        }

        .nitro-collision-line-bottom {
          right: 0;
          animation: nitro-bottom-collision 2.6s
            cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
        }

        @keyframes nitro-top-collision {
          0% { left: 0; }
          100% { left: 58%; }
        }

        @keyframes nitro-bottom-collision {
          0% { right: 0; }
          100% { right: 58%; }
        }

        .nitro-corner {
          position: absolute;
          width: 23px;
          height: 23px;
          border-color: rgba(47, 194, 255, 0.7);
          pointer-events: none;
        }

        .nitro-corner-tl {
          top: 7px;
          left: 7px;
          border-top: 1px solid;
          border-left: 1px solid;
          border-top-left-radius: 5px;
        }

        .nitro-corner-tr {
          top: 7px;
          right: 7px;
          border-top: 1px solid;
          border-right: 1px solid;
          border-top-right-radius: 5px;
        }

        .nitro-corner-bl {
          bottom: 7px;
          left: 7px;
          border-bottom: 1px solid;
          border-left: 1px solid;
          border-bottom-left-radius: 5px;
        }

        .nitro-corner-br {
          bottom: 7px;
          right: 7px;
          border-bottom: 1px solid;
          border-right: 1px solid;
          border-bottom-right-radius: 5px;
        }

        @media (prefers-reduced-motion: reduce) {
          .nitro-collision-line-top,
          .nitro-collision-line-bottom,
          .nitro-games-word {
            animation: none !important;
          }
        }

        /* ========================================
           EXISTING HERO ANIMATIONS
        ======================================== */

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
          0%, 100% {
            opacity: 0.6;
            filter: drop-shadow(0 0 20px rgba(0, 163, 255, 0.4));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 35px rgba(0, 229, 255, 0.8));
          }
        }

        .animate-cyber-glow {
          animation: cyberGlow 4s infinite ease-in-out;
        }

        @keyframes cyberPulseBg {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }

        .animate-cyber-pulse {
          animation: cyberPulseBg 6s infinite ease-in-out;
        }

        @keyframes shimmerSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .shimmer-blue {
          background-size: 200% auto;
          animation: shimmerSweep 4.5s linear infinite;
        }
      `}</style>

      {/* الخلفية */}
      <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" />

      <div className="absolute -top-24 right-1/4 w-[520px] h-[380px] bg-[#00a3ff]/15 blur-[140px] rounded-full pointer-events-none animate-cyber-pulse" />

      <div className="absolute bottom-0 -left-24 w-[520px] h-[380px] bg-[#00e5ff]/15 blur-[140px] rounded-full pointer-events-none animate-cyber-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">

        {/* ========================================
            البانر الفخم — NITRO / GAMES / الأسعار
        ======================================== */}
        <div className="flex justify-center -mt-1 mb-3 px-1">
          <div className="nitro-price-banner w-full max-w-xl">

            <div className="nitro-price-inner flex flex-col items-center justify-center px-5 py-5 sm:py-6">

              <span className="nitro-corner nitro-corner-tl" />
              <span className="nitro-corner nitro-corner-tr" />
              <span className="nitro-corner nitro-corner-bl" />
              <span className="nitro-corner nitro-corner-br" />

              {/* اسم المتجر: كل كلمة في سطر */}
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <span className="nitro-price-brand nitro-price-word text-[27px] sm:text-[33px]">
                  NITRO
                </span>

                <span className="nitro-price-brand nitro-games-word text-[27px] sm:text-[33px]">
                  GAMES
                </span>
              </div>

              {/* فاصل نيون */}
              <div className="nitro-price-separator my-4" />

              {/* العبارة العربية */}
              <p
                dir="rtl"
                className="nitro-price-heading relative z-10 text-center text-[19px] sm:text-[24px] leading-relaxed"
              >
                <span className="text-white">أفضل الأسعار</span>
                <span className="mx-1.5 text-[#38cfff]">في فلسطين</span>
              </p>

              {/* خطّان متحركان على الأطراف */}
              <div className="nitro-collision-track nitro-collision-track-top">
                <span className="nitro-collision-line nitro-collision-line-top" />
              </div>

              <div className="nitro-collision-track nitro-collision-track-bottom">
                <span className="nitro-collision-line nitro-collision-line-bottom" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* اليمين: الشعار والنصوص الرئيسية */}
          <div className="lg:col-span-6 space-y-6 text-right pt-2">
            <div className="flex items-center gap-4 justify-end">
              <div className="text-right">
                <div className="brand-mark brand-mark-lg text-white">
                  NITRO{" "}
                  <span
                    className="brand-mark-games shimmer-blue"
                    style={{
                      backgroundImage:
                        "linear-gradient(100deg, #00a3ff 0%, #00e5ff 25%, #d6f7ff 50%, #00e5ff 75%, #00a3ff 100%)",
                    }}
                  >
                    GAMES
                  </span>
                </div>

                <div className="brand-sub mt-1">
                  PALESTINE · ESPORTS GEAR
                </div>
              </div>

              <div className="relative w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-2xl grad-frame flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(0,163,255,0.3)]">
                <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-[#00a3ff] drop-shadow-[0_0_14px_#00a3ff]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-light text-white leading-[1.25] font-['Cairo']">
              <span className="brand-mark brand-mark-md text-white font-normal">
                NITRO GAMES
              </span>

              <span className="block mt-2 font-black">
                <span className="sr-only">نيترو قيمز — </span>
                خياركم الأفضل في فلسطين
              </span>

              <span className="block text-xl sm:text-3xl lg:text-[2.2rem] text-gray-200 mt-1 font-light">
                للعتاد الاحترافي..{" "}
                <span className="glow-cyan font-bold drop-shadow-[0_0_15px_rgba(0,229,255,0.6)]">
                  ارفع مستوى لعبك!
                </span>
              </span>
            </h1>

            {/* الأزرار وشارة صاحب المتجر */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <div
                dir="ltr"
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#020a17] via-[#091b3a] to-[#020a17] border border-[#00a3ff]/60 shadow-[0_0_25px_rgba(0,163,255,0.3)]"
              >
                <Crown className="w-4 h-4 text-[#00e5ff] fill-[#00a3ff]/30" />

                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                  STORE OWNER:
                </span>

                <span className="text-sm font-black text-[#00e5ff] tracking-widest drop-shadow-[0_0_12px_rgba(0,229,255,0.7)] font-mono">
                  YamEn
                </span>

                <Sparkles className="w-3.5 h-3.5 text-[#00a3ff]" />
              </div>

              <button
                onClick={() => scrollTo("products")}
                className="relative overflow-hidden text-sm sm:text-base px-6 py-2.5 rounded-xl font-black text-[#02121f] bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:shadow-[0_0_35px_rgba(0,229,255,0.9)] hover:scale-[1.03] transition-all duration-300 flex items-center gap-2 cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cfg.ctaLabel || "تسوق الآن"}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* شريط الإحصائيات المتحرك */}
            <div className="w-full overflow-hidden pt-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="animate-marquee-infinite gap-3.5">
                {[...stats, ...stats, ...stats, ...stats].map((s, i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden bg-[#0a101d]/90 backdrop-blur-md border border-[#1a2c4e] hover:border-[#00e5ff]/80 rounded-xl px-4 py-2 text-right flex items-center gap-3 shrink-0 ml-3 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                  >
                    <div className="text-sm sm:text-base font-black text-white font-tech flex items-center gap-2 relative z-10">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a3ff]" />
                      </span>

                      {s.big} {s.icon}
                    </div>

                    <div className="text-[11px] text-gray-300 font-medium font-['Cairo'] relative z-10 border-r border-[#1e345b] pr-3">
                      {s.small}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* اليسار: الفيديو أو عرض المنتجات */}
          <div className="lg:col-span-6 space-y-4 pt-2">
            {cfg.enabled && cfg.videoUrls && cfg.videoUrls.length > 0 ? (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] rounded-3xl blur-xl opacity-60 group-hover:opacity-95 transition duration-1000 group-hover:duration-300 animate-cyber-glow" />

                <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-[#00e5ff]/70 via-[#00a3ff]/40 to-[#0a1630]/90 shadow-[0_25px_60px_-15px_rgba(0,163,255,0.4)]">
                  <div className="relative rounded-[22px] bg-[#040814] overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.06] to-transparent z-20" />

                    <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.8)] scale-105"
                              : "bg-[#09152a] border-[#00a3ff]/40 text-[#00e5ff] hover:border-[#00e5ff]"
                          }`}
                          aria-label={isPlaying ? "Mute sound" : "Play sound"}
                        >
                          {isPlaying ? (
                            <Disc className="w-5 h-5 animate-spin text-black" />
                          ) : (
                            <Music className="w-5 h-5 text-[#00e5ff]" />
                          )}
                        </button>
                      ) : (
                        <span className="text-[9px] font-tech tracking-widest text-[#3a5a8a] uppercase select-none">
                          NITRO · GAMES
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tech font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30 shadow-[inset_0_0_10px_rgba(0,229,255,0.18)]">
                          <Radio className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" />
                          {cfg.badgeText}
                        </span>
                      </div>
                    </div>

                    <div className="relative h-60 sm:h-72 w-full bg-black p-2.5">
                      <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#122347] shadow-[inset_0_0_0_1px_rgba(0,163,255,0.08)]">
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
                            setShowcaseVideoIndex(
                              (i) => (i + 1) % cfg.videoUrls!.length
                            )
                          }
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />

                        <span className="absolute inset-0 pointer-events-none rounded-xl bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />

                        <span className="absolute inset-0 ring-1 ring-inset ring-[#00a3ff]/40 rounded-xl pointer-events-none shadow-[inset_0_0_30px_rgba(0,163,255,0.3)]" />
                      </div>
                    </div>

                    <div className="relative z-10 px-5 py-3 border-t border-[#142342] bg-[#060c1d]/90 backdrop-blur-md flex items-center justify-between gap-3">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo'] tracking-wide">
                        {cfg.headline}
                      </h3>

                      <a
                        href="#products"
                        className="relative overflow-hidden flex items-center gap-2 cursor-pointer whitespace-nowrap rounded-xl text-[11px] font-black px-4 py-2 text-[#02121f] bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] shadow-[0_0_18px_rgba(0,229,255,0.55)] hover:shadow-[0_0_28px_rgba(0,229,255,0.85)] hover:scale-[1.04] transition-all duration-300"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{cfg.ctaLabel}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {siteAudioUrl && (
                  <audio ref={audioRef} src={siteAudioUrl} loop />
                )}
              </div>
            ) : cfg.enabled && active ? (
              <div
                className="relative group"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] rounded-3xl blur-xl opacity-60 group-hover:opacity-95 transition duration-1000 group-hover:duration-300 animate-cyber-glow" />

                <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-[#00e5ff]/60 via-[#00a3ff]/30 to-[#101c38]/80 shadow-[0_0_40px_rgba(0,163,255,0.25)]">
                  <div className="rounded-[22px] bg-[#040814] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`p-2.5 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.8)] scale-105"
                              : "bg-[#09152a] border-[#00a3ff]/40 text-[#00e5ff] hover:border-[#00e5ff]"
                          }`}
                          aria-label={isPlaying ? "Mute sound" : "Play sound"}
                        >
                          {isPlaying ? (
                            <Disc className="w-5 h-5 animate-spin text-black" />
                          ) : (
                            <Music className="w-5 h-5 text-[#00e5ff]" />
                          )}
                        </button>
                      ) : (
                        <div />
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tech font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30 shadow-[inset_0_0_10px_rgba(0,229,255,0.18)]">
                          <Flame className="w-3.5 h-3.5 text-[#00e5ff] fill-[#00a3ff]/40 animate-pulse" />
                          {cfg.badgeText}
                        </span>

                        <div className="flex items-center gap-1.5 mr-2">
                          <button
                            onClick={() => go(-1)}
                            className="p-1.5 rounded-lg bg-[#0e1d3a] hover:bg-[#00a3ff] hover:text-black text-gray-200 transition-colors cursor-pointer border border-[#1d3461]"
                            aria-label="السابق"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => go(1)}
                            className="p-1.5 rounded-lg bg-[#0e1d3a] hover:bg-[#00a3ff] hover:text-black text-gray-200 transition-colors cursor-pointer border border-[#1d3461]"
                            aria-label="التالي"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative h-60 sm:h-72 w-full bg-gradient-to-b from-[#081226] via-[#040814] to-[#02050c]">
                      <div key={active.id} className="absolute inset-0 showcase-enter">
                        <Image
                          src={active.image}
                          alt={active.title}
                          fill
                          priority
                          className="object-contain p-5 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                        />
                      </div>

                      <div className="absolute top-4 left-4 flex flex-col items-start gap-1">
                        {active.originalPrice && (
                          <span className="text-[11px] font-mono text-gray-400 line-through bg-black/70 px-2 py-0.5 rounded-md">
                            {active.originalPrice.toLocaleString()} ₪
                          </span>
                        )}

                        <span className="text-base font-black font-mono text-[#02121f] bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(0,163,255,0.6)]">
                          {active.price.toLocaleString()} ₪
                        </span>
                      </div>

                      <span className="absolute bottom-4 right-4 text-[10px] font-bold font-tech text-[#00e5ff] bg-[#061124]/90 border border-[#00e5ff]/50 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.3)]">
                        {CATEGORIES_META.find(
                          (c) => c.id === active.category
                        )?.name ?? active.category}
                      </span>
                    </div>

                    <div className="px-5 py-3 border-t border-[#142342] bg-[#060c1d] flex items-center justify-between gap-3">
                      <div className="min-w-0 text-right">
                        <div className="text-[10px] font-tech text-[#00a3ff] uppercase tracking-wider">
                          {active.brand}
                        </div>

                        <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo']">
                          {active.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => addToCart(active, 1)}
                        className="relative overflow-hidden flex items-center gap-2 cursor-pointer whitespace-nowrap rounded-xl text-[11px] font-black px-4 py-2 text-[#02121f] bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] shadow-[0_0_18px_rgba(0,229,255,0.55)] hover:shadow-[0_0_28px_rgba(0,229,255,0.85)] hover:scale-[1.04] transition-all duration-300"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>أضف للسلة</span>
                      </button>
                    </div>
                  </div>
                </div>

                {siteAudioUrl && (
                  <audio ref={audioRef} src={siteAudioUrl} loop />
                )}
              </div>
            ) : (
              <div className="panel rounded-2xl h-56 flex flex-col items-center justify-center gap-3 text-center border border-[#16223a]">
                <Zap className="w-10 h-10 text-[#00a3ff]/40" />
                <p className="text-xs text-gray-400">
                  المربع المميز معطّل حالياً من لوحة التحكم
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
