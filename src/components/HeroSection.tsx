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
  Users,
  Play,
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
  const showcaseVideoRef = useRef<HTMLVideoElement | null>(null);

  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showcaseVideoIndex, setShowcaseVideoIndex] = useState(0);

  /* =========================
     LOAD SITE AUDIO
  ========================= */

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

  /* =========================
     VIDEO AUTOPLAY
  ========================= */

  useEffect(() => {
    const video = showcaseVideoRef.current;

    if (!video) return;

    const promise = video.play();

    if (promise && typeof promise.catch === "function") {
      promise.catch(() => {});
    }
  }, [showcaseVideoIndex, cfg.videoUrls]);

  /* =========================
     AUDIO
  ========================= */

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  /* =========================
     SCROLL
  ========================= */

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  /* =========================
     PRODUCTS
  ========================= */

  const showcaseItems = React.useMemo(() => {
    if (cfg.productIds.length > 0) {
      const picked = cfg.productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p));

      if (picked.length > 0) return picked;
    }

    return products.slice(0, 6);
  }, [cfg.productIds, products]);

  const active = showcaseItems[slide];

  /* =========================
     SLIDER
  ========================= */

  const go = useCallback(
    (direction: number) => {
      if (showcaseItems.length === 0) return;

      setSlide(
        (current) =>
          (current + direction + showcaseItems.length) %
          showcaseItems.length
      );
    },
    [showcaseItems.length]
  );

  useEffect(() => {
    if (!cfg.autoPlay || paused || showcaseItems.length < 2) return;

    const timer = setInterval(() => {
      go(1);
    }, Math.max(1800, cfg.intervalMs));

    return () => clearInterval(timer);
  }, [
    cfg.autoPlay,
    cfg.intervalMs,
    paused,
    go,
    showcaseItems.length,
  ]);

  useEffect(() => {
    if (slide >= showcaseItems.length) {
      setSlide(0);
    }
  }, [showcaseItems.length, slide]);

  /* =========================
     STATS
  ========================= */

  const stats = [
    {
      icon: <Users className="w-4 h-4" />,
      big: "+5,400",
      small: "لاعب يثق بنا",
    },
    {
      icon: <ShieldCheck className="w-4 h-4" />,
      big: "1 سنة",
      small: "ضمان حقيقي",
    },
    {
      icon: <CheckCircle2 className="w-4 h-4" />,
      big: "100%",
      small: "أصلي معتمد",
    },
    {
      icon: <Truck className="w-4 h-4" />,
      big: "24-48h",
      small: "شحن سريع",
    },
  ];

  return (
    <section
      id="hero"
      dir="rtl"
      className="relative overflow-hidden bg-[#02050d] border-b border-[#10203b]"
    >
      {/* =========================
          BACKGROUND
      ========================= */}

      <style>{`
        @keyframes nitroFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes nitroPulse {
          0%, 100% {
            opacity: .45;
            transform: scale(.95);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes nitroGlow {
          0%, 100% {
            box-shadow:
              0 0 20px rgba(0,163,255,.15),
              inset 0 0 20px rgba(0,163,255,.03);
          }
          50% {
            box-shadow:
              0 0 35px rgba(0,229,255,.28),
              inset 0 0 30px rgba(0,163,255,.06);
          }
        }

        @keyframes nitroShimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .nitro-float {
          animation: nitroFloat 4s ease-in-out infinite;
        }

        .nitro-pulse {
          animation: nitroPulse 2s ease-in-out infinite;
        }

        .nitro-glow {
          animation: nitroGlow 4s ease-in-out infinite;
        }

        .nitro-shimmer {
          background-size: 200% auto;
          animation: nitroShimmer 4s linear infinite;
        }

        .nitro-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .nitro-scrollbar {
          scrollbar-width: none;
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(0,163,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,163,255,.035) 1px, transparent 1px);
          background-size: 35px 35px;
        }
      `}</style>

      <div className="absolute inset-0 hero-grid pointer-events-none" />

      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[420px] h-[320px] rounded-full bg-[#0066ff]/10 blur-[100px] pointer-events-none" />

      <div className="absolute bottom-0 right-[-120px] w-[300px] h-[300px] rounded-full bg-[#00e5ff]/10 blur-[100px] pointer-events-none" />

      {/* =========================
          MAIN
      ========================= */}

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* =========================
            MOBILE TOP BAR
        ========================= */}

        <div className="pt-4 sm:pt-7">

          <div className="flex items-center justify-between gap-2">

            {/* Logo */}

            <div className="text-right min-w-0">

              <div className="leading-none">

                <span className="text-[25px] sm:text-3xl font-black italic tracking-[-1.5px] text-white">
                  NITRO
                </span>

                <span
                  className="text-[25px] sm:text-3xl font-black italic tracking-[-1.5px] ml-1 nitro-shimmer"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg,#00a3ff,#00e5ff,#ffffff,#00e5ff,#00a3ff)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  GAMES
                </span>

              </div>

              <div className="text-[7px] sm:text-[9px] tracking-[3px] text-[#6282a8] mt-1">
                PALESTINE · ESPORTS GEAR
              </div>

            </div>

            {/* Owner */}

            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl border border-[#00a3ff]/30 bg-[#071326]/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,163,255,.08)]">

              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00a3ff] to-[#00e5ff] flex items-center justify-center">
                <Crown className="w-3.5 h-3.5 text-[#02121f]" />
              </div>

              <div className="text-left leading-none">
                <div className="text-[7px] text-gray-500 tracking-widest">
                  OWNER
                </div>

                <div className="text-[11px] sm:text-xs font-black text-[#00e5ff] mt-1">
                  YamEn
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* =========================
            HERO INTRO
        ========================= */}

        <div className="text-center pt-7 sm:pt-12 pb-6">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#00a3ff]/30 bg-[#061329]/70 text-[9px] sm:text-xs text-gray-300">

            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[#00e5ff] animate-ping" />
              <span className="relative rounded-full w-1.5 h-1.5 bg-[#00e5ff]" />
            </span>

            المتجر الأول لطرفيات الجيمينج في فلسطين

          </div>

          <h1 className="mt-5 text-[29px] sm:text-5xl font-black leading-[1.15] text-white">

            العب بشكل
            <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] via-[#00e5ff] to-white">
              مختلف تمامًا
            </span>

          </h1>

          <p className="mt-3 max-w-[350px] mx-auto text-[12px] sm:text-base leading-6 text-gray-400">
            عتاد جيمينج احترافي، أصلي ومضمون،
            بأسعار تناسب اللاعب الفلسطيني.
          </p>

        </div>

        {/* =========================
            MAIN SHOWCASE
        ========================= */}

        {cfg.enabled && cfg.videoUrls?.length > 0 ? (

          /* =========================
             VIDEO SHOWCASE
          ========================= */

          <div className="relative pb-6">

            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-[#0055ff] via-[#00e5ff] to-[#0055ff] blur-xl opacity-25" />

            <div className="relative rounded-[24px] p-[1px] bg-gradient-to-br from-[#00e5ff]/70 via-[#0066ff]/30 to-[#14284b]">

              <div className="rounded-[23px] overflow-hidden bg-[#030812]">

                {/* Video Header */}

                <div className="flex items-center justify-between px-3.5 py-3 border-b border-[#132544] bg-[#071225]">

                  {siteAudioUrl ? (
                    <button
                      onClick={toggleAudio}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                        isPlaying
                          ? "bg-[#00e5ff] text-black border-[#00e5ff]"
                          : "bg-[#0a1830] text-[#00e5ff] border-[#00a3ff]/30"
                      }`}
                    >
                      {isPlaying ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <Music className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-2">

                    <span className="flex items-center gap-1.5 text-[9px] font-black text-[#00e5ff] px-2.5 py-1.5 rounded-lg bg-[#081a32] border border-[#00e5ff]/20">

                      <Radio className="w-3 h-3 animate-pulse" />

                      {cfg.badgeText}

                    </span>

                  </div>

                </div>

                {/* Video */}

                <div className="p-2">

                  <div className="relative aspect-[16/10] sm:aspect-video overflow-hidden rounded-[17px] bg-black border border-[#143057]">

                    <video
                      ref={showcaseVideoRef}
                      key={
                        cfg.videoUrls[
                          showcaseVideoIndex % cfg.videoUrls.length
                        ]
                      }
                      src={
                        cfg.videoUrls[
                          showcaseVideoIndex % cfg.videoUrls.length
                        ]
                      }
                      autoPlay
                      muted
                      loop={cfg.videoUrls.length === 1}
                      playsInline
                      controls
                      onEnded={() =>
                        setShowcaseVideoIndex(
                          (i) => (i + 1) % cfg.videoUrls.length
                        )
                      }
                      className="absolute inset-0 w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/10" />

                    {cfg.videoUrls.length > 1 && (
                      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur border border-[#00e5ff]/30 text-[#00e5ff] text-[9px]">
                        {showcaseVideoIndex + 1} /{" "}
                        {cfg.videoUrls.length}
                      </div>
                    )}

                  </div>

                </div>

                {/* Video Footer */}

                <div className="flex items-center justify-between gap-3 p-3.5">

                  <div className="min-w-0 text-right">

                    <div className="text-[9px] text-[#00a3ff] font-bold uppercase tracking-wider">
                      NITRO GAMES
                    </div>

                    <h3 className="text-[12px] sm:text-sm font-bold text-white truncate mt-1">
                      {cfg.headline}
                    </h3>

                  </div>

                  <button
                    onClick={scrollToProducts}
                    className="shrink-0 h-10 px-4 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-[#02121f] text-[10px] font-black flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,229,255,.35)] active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    تسوق الآن
                  </button>

                </div>

              </div>

            </div>

            {siteAudioUrl && (
              <audio ref={audioRef} src={siteAudioUrl} loop />
            )}

          </div>

        ) : cfg.enabled && active ? (

          /* =========================
             PRODUCT SHOWCASE
          ========================= */

          <div
            className="relative pb-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >

            {/* Glow */}

            <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-[#0055ff] via-[#00e5ff] to-[#0055ff] blur-2xl opacity-20" />

            <div className="relative rounded-[25px] p-[1px] bg-gradient-to-br from-[#00e5ff]/80 via-[#0066ff]/30 to-[#13284d]">

              <div className="rounded-[24px] overflow-hidden bg-[#030812]">

                {/* Showcase Header */}

                <div className="flex items-center justify-between p-3 border-b border-[#132544] bg-[#071225]">

                  {/* Audio */}

                  {siteAudioUrl ? (
                    <button
                      onClick={toggleAudio}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                        isPlaying
                          ? "bg-[#00e5ff] text-black border-[#00e5ff]"
                          : "bg-[#09182f] text-[#00e5ff] border-[#00a3ff]/30"
                      }`}
                    >
                      {isPlaying ? (
                        <Disc className="w-4 h-4 animate-spin" />
                      ) : (
                        <Music className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    <div className="w-9" />
                  )}

                  {/* Controls */}

                  <div className="flex items-center gap-2">

                    <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#091a34] border border-[#00e5ff]/20 text-[#00e5ff] text-[9px] font-black">

                      <Flame className="w-3 h-3" />

                      {cfg.badgeText}

                    </span>

                    <button
                      onClick={() => go(-1)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0b1b35] border border-[#1a355d] text-gray-200 active:scale-90"
                      aria-label="السابق"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => go(1)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0b1b35] border border-[#1a355d] text-gray-200 active:scale-90"
                      aria-label="التالي"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                  </div>

                </div>

                {/* =========================
                    PRODUCT IMAGE
                ========================= */}

                <div className="relative aspect-[1/1] sm:aspect-[4/3] bg-gradient-to-b from-[#09172e] via-[#040914] to-[#02050b] overflow-hidden">

                  {/* Background Glow */}

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[230px] h-[230px] rounded-full bg-[#006eff]/10 blur-[65px]" />

                  {/* Product */}

                  <div
                    key={active.id}
                    className="absolute inset-0 nitro-float"
                  >

                    <Image
                      src={active.image}
                      alt={active.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-contain p-8 sm:p-12 drop-shadow-[0_20px_35px_rgba(0,0,0,.9)]"
                    />

                  </div>

                  {/* Product Counter */}

                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur border border-[#00e5ff]/30 text-[#00e5ff] text-[9px] font-bold">
                    {slide + 1} / {showcaseItems.length}
                  </div>

                  {/* HOT */}

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#100d16]/80 backdrop-blur border border-[#ff315b]/40 text-[#ff5476] text-[9px] font-black">

                    <Flame className="w-3 h-3 fill-current" />

                    HOT DEAL

                  </div>

                  {/* PRICE */}

                  <div className="absolute bottom-4 left-4">

                    {active.originalPrice && (
                      <div className="text-[10px] text-gray-400 line-through mb-1 bg-black/60 px-2 py-0.5 rounded">
                        {active.originalPrice.toLocaleString()} ₪
                      </div>
                    )}

                    <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-[#02121f] shadow-[0_0_25px_rgba(0,229,255,.4)]">

                      <div className="text-[9px] font-bold opacity-70">
                        السعر
                      </div>

                      <div className="text-xl font-black font-mono leading-none">
                        {active.price.toLocaleString()} ₪
                      </div>

                    </div>

                  </div>

                  {/* CATEGORY */}

                  <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-[#061124]/90 border border-[#00e5ff]/30 text-[#00e5ff] text-[9px] font-bold backdrop-blur">

                    {
                      CATEGORIES_META.find(
                        (c) => c.id === active.category
                      )?.name ?? active.category
                    }

                  </div>

                </div>

                {/* =========================
                    PRODUCT INFO
                ========================= */}

                <div className="p-4 bg-[#050c1a] border-t border-[#132544]">

                  <div className="flex items-end justify-between gap-3">

                    <div className="min-w-0 text-right">

                      <div className="text-[9px] font-bold text-[#00a3ff] tracking-wider uppercase">
                        {active.brand}
                      </div>

                      <h2 className="mt-1 text-sm sm:text-base font-black text-white leading-6 line-clamp-2">
                        {active.title}
                      </h2>

                    </div>

                    <button
                      onClick={() => addToCart(active, 1)}
                      className="shrink-0 h-11 px-4 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-[#02121f] font-black text-[10px] flex items-center gap-2 shadow-[0_0_22px_rgba(0,229,255,.35)] active:scale-95 transition-transform"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      أضف للسلة
                    </button>

                  </div>

                </div>

              </div>

            </div>

            {siteAudioUrl && (
              <audio ref={audioRef} src={siteAudioUrl} loop />
            )}

          </div>

        ) : (

          <div className="rounded-2xl border border-[#132544] bg-[#050b17] py-16 flex flex-col items-center justify-center text-center">

            <Sparkles className="w-10 h-10 text-[#00a3ff]/40" />

            <p className="mt-3 text-xs text-gray-500">
              المربع المميز معطّل حالياً من لوحة التحكم
            </p>

          </div>

        )}

        {/* =========================
            CTA BUTTONS
        ========================= */}

        <div className="grid grid-cols-2 gap-2.5 pb-5">

          <button
            onClick={scrollToProducts}
            className="h-12 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-[#02121f] font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,229,255,.2)] active:scale-[.97]"
          >
            <ShoppingBag className="w-4 h-4" />
            تسوق الآن
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={scrollToProducts}
            className="h-12 rounded-xl bg-[#071326] border border-[#1b3b69] text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-[.97]"
          >
            تصفح المنتجات
            <ChevronLeft className="w-4 h-4 text-[#00e5ff]" />
          </button>

        </div>

        {/* =========================
            MOBILE STATS
        ========================= */}

        <div className="pb-6">

          <div className="flex gap-2.5 overflow-x-auto nitro-scrollbar snap-x">

            {stats.map((stat, index) => (

              <div
                key={index}
                className="snap-start shrink-0 w-[145px] sm:flex-1 sm:w-auto rounded-2xl border border-[#142b4e] bg-[#061022]/90 backdrop-blur-md p-3.5"
              >

                <div className="flex items-center gap-2.5">

                  <div className="w-9 h-9 shrink-0 rounded-xl bg-[#071a32] border border-[#00a3ff]/20 flex items-center justify-center text-[#00e5ff]">
                    {stat.icon}
                  </div>

                  <div className="min-w-0">

                    <div className="text-sm font-black text-white font-mono">
                      {stat.big}
                    </div>

                    <div className="text-[8px] text-gray-500 mt-0.5 whitespace-nowrap">
                      {stat.small}
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* =========================
            TRUST BAR
        ========================= */}

        <div className="pb-8">

          <div className="relative overflow-hidden rounded-2xl border border-[#12305a] bg-gradient-to-r from-[#061021] via-[#08172c] to-[#061021] p-4">

            <div className="flex items-center justify-center gap-2 mb-3">

              <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />

              <span className="text-[9px] font-black tracking-[2px] text-[#00e5ff]">
                WHY NITRO GAMES
              </span>

              <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />

            </div>

            <div className="grid grid-cols-3 divide-x divide-[#163156] divide-x-reverse">

              <div className="text-center px-2">

                <ShieldCheck className="w-5 h-5 mx-auto text-[#00e5ff]" />

                <div className="text-[9px] font-bold text-white mt-1.5">
                  ضمان حقيقي
                </div>

                <div className="text-[7px] text-gray-500 mt-1">
                  سنة كاملة
                </div>

              </div>

              <div className="text-center px-2">

                <CheckCircle2 className="w-5 h-5 mx-auto text-[#00e5ff]" />

                <div className="text-[9px] font-bold text-white mt-1.5">
                  أصلي 100%
                </div>

                <div className="text-[7px] text-gray-500 mt-1">
                  منتجات موثوقة
                </div>

              </div>

              <div className="text-center px-2">

                <Truck className="w-5 h-5 mx-auto text-[#00e5ff]" />

                <div className="text-[9px] font-bold text-white mt-1.5">
                  شحن سريع
                </div>

                <div className="text-[7px] text-gray-500 mt-1">
                  24 - 48 ساعة
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================
          BOTTOM GLOW
      ========================= */}

      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#00a3ff] to-transparent opacity-70" />

    </section>
  );
};
