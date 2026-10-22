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
  Headphones,
  BadgeCheck,
  Trophy,
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
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

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
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
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

    const timer = setInterval(
      () => go(1),
      Math.max(1200, cfg.intervalMs)
    );

    return () => clearInterval(timer);
  }, [cfg.autoPlay, cfg.intervalMs, paused, go, showcaseItems.length]);

  useEffect(() => {
    if (slide >= showcaseItems.length) setSlide(0);
  }, [showcaseItems.length, slide]);

  const active = showcaseItems[slide];

  const stats = [
    {
      icon: <span className="text-[#48eaff]">★</span>,
      big: "+5,400",
      small: "لاعب يثق بنا",
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#48eaff]" />,
      big: "1 سنة",
      small: "ضمان حقيقي",
    },
    {
      icon: <CheckCircle2 className="w-4 h-4 text-[#48eaff]" />,
      big: "100%",
      small: "أصلي معتمد",
    },
    {
      icon: <Truck className="w-4 h-4 text-[#48eaff]" />,
      big: "24-48h",
      small: "شحن سريع",
    },
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-3 pb-14 lg:pt-6 lg:pb-24 bg-[#020611] border-b border-[#10264a]"
    >
      <style>{`
        .nitro-premium-banner {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          border: 1px solid rgba(31, 147, 255, .48);
          border-radius: 22px;
          background:
            radial-gradient(ellipse at 50% 0%, rgba(0, 114, 255, .2), transparent 60%),
            linear-gradient(145deg, #07152b 0%, #030916 55%, #06132a 100%);
          box-shadow:
            0 0 0 1px rgba(0, 180, 255, .06),
            0 12px 40px rgba(0, 0, 0, .3),
            0 0 28px rgba(0, 105, 255, .12);
        }

        .nitro-premium-banner::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background:
            linear-gradient(115deg, transparent 20%, rgba(0, 145, 255, .07) 50%, transparent 80%),
            repeating-linear-gradient(135deg, transparent 0 34px, rgba(60, 151, 255, .035) 35px, transparent 36px);
        }

        .nitro-banner-brand {
          display: block;
          font-family: Arial, Helvetica, sans-serif;
          font-style: italic;
          font-weight: 950;
          line-height: .9;
          letter-spacing: .16em;
          text-align: center;
        }

        .nitro-banner-white {
          color: #f5fbff;
          text-shadow: 0 0 15px rgba(130, 202, 255, .24);
        }

        .nitro-banner-blue {
          color: #25baff;
          background: linear-gradient(100deg, #087cff, #65edff 48%, #0c91ff 90%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: nitro-brand-flow 5s linear infinite;
          filter: drop-shadow(0 0 12px rgba(0, 151, 255, .25));
        }

        @keyframes nitro-brand-flow {
          from { background-position: 100% center; }
          to { background-position: -100% center; }
        }

        .nitro-banner-divider {
          width: min(260px, 75%);
          height: 1px;
          position: relative;
          background: linear-gradient(90deg, transparent, #087cff, #4ceaff, #087cff, transparent);
          box-shadow: 0 0 10px rgba(0, 170, 255, .45);
        }

        .nitro-banner-divider::after {
          content: "";
          position: absolute;
          width: 42px;
          height: 3px;
          border-radius: 99px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background: #6af1ff;
          box-shadow: 0 0 8px #168bff, 0 0 18px #00aaff;
        }

        .nitro-banner-heading {
          font-family: "Cairo", Arial, sans-serif;
          font-weight: 900;
          letter-spacing: -.035em;
          text-shadow: 0 2px 18px rgba(0, 132, 255, .2);
        }

        .nitro-edge-track {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          overflow: hidden;
          pointer-events: none;
        }

        .nitro-edge-track.top { top: 0; }
        .nitro-edge-track.bottom { bottom: 0; }

        .nitro-edge-line {
          position: absolute;
          top: 0;
          width: 42%;
          height: 2px;
          border-radius: 99px;
          background: linear-gradient(90deg, transparent, #087cff 20%, #65f1ff 50%, #087cff 80%, transparent);
          box-shadow: 0 0 8px #168bff, 0 0 16px rgba(0, 170, 255, .8);
        }

        .nitro-edge-line.top {
          left: 0;
          animation: nitro-line-top 2.8s ease-in-out infinite alternate;
        }

        .nitro-edge-line.bottom {
          right: 0;
          animation: nitro-line-bottom 2.8s ease-in-out infinite alternate;
        }

        @keyframes nitro-line-top {
          from { transform: translateX(0); }
          to { transform: translateX(138%); }
        }

        @keyframes nitro-line-bottom {
          from { transform: translateX(0); }
          to { transform: translateX(-138%); }
        }

        .nitro-corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: rgba(69, 205, 255, .75);
          pointer-events: none;
        }

        .nitro-corner.tl {
          top: 8px;
          left: 8px;
          border-top: 1px solid;
          border-left: 1px solid;
          border-top-left-radius: 5px;
        }

        .nitro-corner.tr {
          top: 8px;
          right: 8px;
          border-top: 1px solid;
          border-right: 1px solid;
          border-top-right-radius: 5px;
        }

        .nitro-corner.bl {
          bottom: 8px;
          left: 8px;
          border-bottom: 1px solid;
          border-left: 1px solid;
          border-bottom-left-radius: 5px;
        }

        .nitro-corner.br {
          bottom: 8px;
          right: 8px;
          border-bottom: 1px solid;
          border-right: 1px solid;
          border-bottom-right-radius: 5px;
        }

        .nitro-shop-button {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 52px;
          padding: 12px 24px;
          border: 1px solid rgba(139, 239, 255, .9);
          border-radius: 15px;
          color: #02101e;
          font-family: "Cairo", Arial, sans-serif;
          font-weight: 900;
          background: linear-gradient(110deg, #078bff 0%, #23cfff 48%, #8af4ff 100%);
          box-shadow:
            0 0 0 3px rgba(0, 157, 255, .09),
            0 0 18px rgba(0, 169, 255, .4),
            inset 0 1px 0 rgba(255,255,255,.6);
          transition: transform .25s ease, box-shadow .25s ease;
          cursor: pointer;
        }

        .nitro-shop-button::before {
          content: "";
          position: absolute;
          z-index: -1;
          top: -40%;
          bottom: -40%;
          left: -65%;
          width: 38%;
          transform: skewX(-22deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.65), transparent);
          transition: left .65s ease;
        }

        .nitro-shop-button:hover::before,
        .nitro-shop-button:focus-visible::before {
          left: 130%;
        }

        .nitro-shop-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 0 4px rgba(0, 157, 255, .12), 0 0 30px rgba(0, 205, 255, .65);
        }

        .nitro-shop-button:active {
          transform: scale(.97);
        }

        .nitro-shop-button:focus-visible {
          outline: 2px solid #fff;
          outline-offset: 4px;
        }

        /* بطاقات المزايا الجديدة */
        .nitro-feature-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 0;
          min-height: 62px;
          padding: 10px 7px;
          overflow: hidden;
          border: 1px solid rgba(44, 142, 255, .24);
          border-radius: 13px;
          background: linear-gradient(145deg, rgba(10, 30, 59, .88), rgba(4, 12, 27, .96));
          color: #e5f3ff;
          font-family: "Cairo", Arial, sans-serif;
          transition: border-color .25s ease, background .25s ease, transform .25s ease, box-shadow .25s ease;
        }

        .nitro-feature-card::before {
          content: "";
          position: absolute;
          top: 0;
          right: 15%;
          left: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(44, 190, 255, .7), transparent);
        }

        .nitro-feature-card:hover {
          transform: translateY(-2px);
          border-color: rgba(44, 210, 255, .58);
          background: linear-gradient(145deg, rgba(12, 44, 83, .95), rgba(4, 15, 34, .98));
          box-shadow: 0 6px 20px rgba(0, 115, 255, .12);
        }

        .nitro-feature-icon {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 1px solid rgba(0, 174, 255, .3);
          border-radius: 10px;
          color: #43dfff;
          background: rgba(0, 117, 255, .11);
        }

        .nitro-feature-text {
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

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
            opacity: .6;
            filter: drop-shadow(0 0 20px rgba(0, 163, 255, .4));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 35px rgba(0, 229, 255, .8));
          }
        }

        .animate-cyber-glow {
          animation: cyberGlow 4s infinite ease-in-out;
        }

        @keyframes cyberPulseBg {
          0%, 100% { transform: scale(1); opacity: .3; }
          50% { transform: scale(1.05); opacity: .6; }
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

        @media (max-width: 420px) {
          .nitro-feature-card {
            gap: 5px;
            min-height: 56px;
            padding: 8px 4px;
          }

          .nitro-feature-icon {
            width: 28px;
            height: 28px;
          }

          .nitro-feature-icon svg {
            width: 16px;
            height: 16px;
          }

          .nitro-feature-text {
            font-size: 10px;
          }
        }

        @media (max-width: 360px) {
          .nitro-feature-card {
            flex-direction: column;
            gap: 5px;
          }

          .nitro-feature-text {
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nitro-banner-blue,
          .nitro-edge-line,
          .nitro-shop-button::before,
          .animate-marquee-infinite,
          .animate-cyber-glow,
          .animate-cyber-pulse,
          .shimmer-blue {
            animation: none !important;
            transition: none !important;
          }

          .nitro-shop-button:hover,
          .nitro-feature-card:hover {
            transform: none;
          }
        }
      `}</style>

      {/* خلفية الموقع */}
      <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-[520px] h-[380px] bg-[#007cff]/15 blur-[140px] rounded-full pointer-events-none animate-cyber-pulse" />
      <div className="absolute bottom-0 -left-24 w-[520px] h-[380px] bg-[#00dfff]/10 blur-[140px] rounded-full pointer-events-none animate-cyber-pulse" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-7">

        {/* البنر العلوي */}
        <div className="flex justify-center -mt-1 mb-2 px-0.5">
          <div className="nitro-premium-banner w-full max-w-xl">
            <div className="relative flex flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-7">
              <span className="nitro-corner tl" />
              <span className="nitro-corner tr" />
              <span className="nitro-corner bl" />
              <span className="nitro-corner br" />

              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <span className="nitro-banner-brand nitro-banner-white text-[29px] sm:text-[37px]">
                  NITRO
                </span>
                <span className="nitro-banner-brand nitro-banner-blue text-[29px] sm:text-[37px]">
                  GAMES
                </span>
                <span className="mt-1 text-[8px] sm:text-[10px] tracking-[.38em] text-[#8ab8e9] font-bold">
                  PALESTINE · ESPORTS GEAR
                </span>
              </div>

              <div className="nitro-banner-divider my-4 sm:my-5" />

              <p
                dir="rtl"
                className="nitro-banner-heading relative z-10 text-center text-[20px] sm:text-[27px] leading-relaxed"
              >
                <span className="text-white">أفضل الأسعار</span>
                <span className="mx-1.5 text-[#43dfff]">في فلسطين</span>
              </p>

              <p
                dir="rtl"
                className="relative z-10 mt-1 text-center text-[11px] sm:text-sm text-[#9eb8d8]"
              >
                عتاد احترافي • تجربة لعب أقوى
              </p>

              <div className="nitro-edge-track top">
                <span className="nitro-edge-line top" />
              </div>
              <div className="nitro-edge-track bottom">
                <span className="nitro-edge-line bottom" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-start">

          {/* القسم الرئيسي */}
          <div className="lg:col-span-6 space-y-5 text-right pt-0">
            <div className="flex items-center gap-4 justify-end">
              <div className="text-right">
                <div className="brand-mark brand-mark-lg text-white">
                  NITRO{" "}
                  <span
                    className="brand-mark-games shimmer-blue"
                    style={{
                      backgroundImage:
                        "linear-gradient(100deg, #078bff 0%, #00e5ff 25%, #d6f7ff 50%, #00e5ff 75%, #078bff 100%)",
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
                <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-[#00cfff] drop-shadow-[0_0_14px_#00a3ff]" />
              </div>
            </div>

            <h1
              dir="rtl"
              className="text-3xl sm:text-4xl lg:text-[2.8rem] font-light text-white leading-[1.22] font-['Cairo']"
            >
              <span className="block font-black tracking-tight">
                خياركم الأفضل{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#71efff] via-[#19baff] to-[#078bff]">
                  في فلسطين
                </span>
              </span>

              <span className="block text-lg sm:text-2xl lg:text-[2rem] text-gray-300 mt-3 font-light leading-relaxed">
                للعتاد الاحترافي..
                <span className="glow-cyan font-bold text-[#39dfff] drop-shadow-[0_0_15px_rgba(0,229,255,0.45)]">
                  {" "}ارفع مستوى لعبك!
                </span>
              </span>
            </h1>

            {/* المزايا الأربع — تصميم جديد */}
            <div
              dir="rtl"
              className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
            >
              <div className="nitro-feature-card">
                <span className="nitro-feature-icon">
                  <BadgeCheck className="w-5 h-5" />
                </span>
                <span className="nitro-feature-text">منتجات أصلية</span>
              </div>

              <div className="nitro-feature-card">
                <span className="nitro-feature-icon">
                  <Truck className="w-5 h-5" />
                </span>
                <span className="nitro-feature-text">شحن سريع</span>
              </div>

              <div className="nitro-feature-card">
                <span className="nitro-feature-icon">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <span className="nitro-feature-text">ضمان حقيقي</span>
              </div>

              <button
                type="button"
                onClick={() => scrollTo("products")}
                className="nitro-feature-card cursor-pointer"
                aria-label="استعرض أفضل المنتجات"
              >
                <span className="nitro-feature-icon">
                  <Trophy className="w-5 h-5" />
                </span>
                <span className="nitro-feature-text">أفضل المنتجات</span>
              </button>
            </div>

            {/* صاحب المتجر وزر التسوق */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <div
                dir="ltr"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#020a17] via-[#091b3a] to-[#020a17] border border-[#078bff]/50 shadow-[0_0_20px_rgba(0,163,255,0.16)]"
              >
                <Crown className="w-4 h-4 text-[#43eaff]" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                  STORE OWNER:
                </span>
                <span className="text-sm font-black text-[#43eaff] tracking-widest font-mono">
                  YamEn
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#078bff]" />
              </div>

              <button
                onClick={() => scrollTo("products")}
                className="nitro-shop-button text-sm sm:text-base group"
                aria-label="تسوق الآن واستعرض المنتجات"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{cfg.ctaLabel || "تسوق الآن"}</span>
                <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
              </button>
            </div>

            {/* الإحصائيات المتحركة */}
            <div className="w-full overflow-hidden pt-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="animate-marquee-infinite gap-3.5">
                {[...stats, ...stats, ...stats, ...stats].map((s, i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden bg-[#071120]/95 backdrop-blur-md border border-[#17345a] hover:border-[#00dfff]/70 rounded-xl px-4 py-2 text-right flex items-center gap-3 shrink-0 ml-3 transition-colors duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
                  >
                    <div className="text-sm sm:text-base font-black text-white flex items-center gap-2 relative z-10">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-60" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#078bff]" />
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

          {/* الفيديو أو عرض المنتجات */}
          <div className="lg:col-span-6 space-y-4 pt-1">
            {cfg.enabled && cfg.videoUrls && cfg.videoUrls.length > 0 ? (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] rounded-3xl blur-xl opacity-50 group-hover:opacity-90 transition duration-700 animate-cyber-glow" />

                <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-[#00e5ff]/70 via-[#078bff]/40 to-[#0a1630]/90 shadow-[0_25px_60px_-15px_rgba(0,163,255,0.35)]">
                  <div className="relative rounded-[22px] bg-[#040814] overflow-hidden">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.06] to-transparent z-20" />

                    <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer border flex items-center justify-center ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#078bff] to-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.6)]"
                              : "bg-[#09152a] border-[#078bff]/40 text-[#00e5ff] hover:border-[#00e5ff]"
                          }`}
                          aria-label={isPlaying ? "إيقاف الصوت" : "تشغيل الصوت"}
                        >
                          {isPlaying ? (
                            <Disc className="w-5 h-5 animate-spin text-black" />
                          ) : (
                            <Music className="w-5 h-5 text-[#00e5ff]" />
                          )}
                        </button>
                      ) : (
                        <span className="text-[9px] tracking-widest text-[#3a5a8a] uppercase select-none">
                          NITRO · GAMES
                        </span>
                      )}

                      <span className="text-[10px] font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30">
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        {cfg.badgeText}
                      </span>
                    </div>

                    <div className="relative h-60 sm:h-72 w-full bg-black p-2.5">
                      <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#122347]">
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

                        <span className="absolute inset-0 pointer-events-none rounded-xl bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.4)_100%)]" />
                        <span className="absolute inset-0 ring-1 ring-inset ring-[#078bff]/40 rounded-xl pointer-events-none" />
                      </div>
                    </div>

                    <div className="relative z-10 px-5 py-3 border-t border-[#142342] bg-[#060c1d]/90 flex items-center justify-between gap-3">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo']">
                        {cfg.headline}
                      </h3>

                      <button
                        onClick={() => scrollTo("products")}
                        className="nitro-shop-button !min-h-10 !rounded-lg !px-3 !py-2 !text-[11px] !gap-2"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{cfg.ctaLabel || "تسوق الآن"}</span>
                      </button>
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
                <div className="absolute -inset-1 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] rounded-3xl blur-xl opacity-50 group-hover:opacity-90 transition duration-700 animate-cyber-glow" />

                <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-[#00e5ff]/60 via-[#078bff]/30 to-[#101c38]/80 shadow-[0_0_40px_rgba(0,163,255,0.22)]">
                  <div className="rounded-[22px] bg-[#040814] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`p-2.5 rounded-xl transition-colors cursor-pointer border flex items-center justify-center ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#078bff] to-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.6)]"
                              : "bg-[#09152a] border-[#078bff]/40 text-[#00e5ff] hover:border-[#00e5ff]"
                          }`}
                          aria-label={isPlaying ? "إيقاف الصوت" : "تشغيل الصوت"}
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
                        <span className="text-[10px] font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30">
                          <Flame className="w-3.5 h-3.5 text-[#00e5ff] fill-[#078bff]/40 animate-pulse" />
                          {cfg.badgeText}
                        </span>

                        <div className="flex items-center gap-1.5 mr-2">
                          <button
                            onClick={() => go(-1)}
                            className="p-1.5 rounded-lg bg-[#0e1d3a] hover:bg-[#078bff] hover:text-black text-gray-200 transition-colors cursor-pointer border border-[#1d3461]"
                            aria-label="السابق"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => go(1)}
                            className="p-1.5 rounded-lg bg-[#0e1d3a] hover:bg-[#078bff] hover:text-black text-gray-200 transition-colors cursor-pointer border border-[#1d3461]"
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

                        <span className="text-base font-black font-mono text-[#02121f] bg-gradient-to-r from-[#078bff] to-[#00e5ff] px-3 py-1 rounded-lg shadow-[0_0_20px_rgba(0,163,255,0.45)]">
                          {active.price.toLocaleString()} ₪
                        </span>
                      </div>

                      <span className="absolute bottom-4 right-4 text-[10px] font-bold text-[#00e5ff] bg-[#061124]/90 border border-[#00e5ff]/50 px-3 py-1 rounded-full">
                        {CATEGORIES_META.find((c) => c.id === active.category)?.name ?? active.category}
                      </span>
                    </div>

                    <div className="px-5 py-3 border-t border-[#142342] bg-[#060c1d] flex items-center justify-between gap-3">
                      <div className="min-w-0 text-right">
                        <div className="text-[10px] text-[#00a3ff] uppercase tracking-wider">
                          {active.brand}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo']">
                          {active.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => addToCart(active, 1)}
                        className="nitro-shop-button !min-h-10 !rounded-lg !px-3 !py-2 !text-[11px] !gap-2"
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
              <div className="panel rounded-2xl h-56 flex flex-col items-center justify-center gap-3 text-center border border-[#16223a]">
                <Headphones className="w-10 h-10 text-[#078bff]/50" />
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
