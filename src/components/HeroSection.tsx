"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Image from "next/image";
import {
  Product,
  ShowcaseConfig,
  DEFAULT_SHOWCASE,
} from "@/lib/data";
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
  ChevronLeft,
  ChevronRight,
  Eye,
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

  /* =========================
     VIDEO AUTOPLAY
  ========================= */

  useEffect(() => {
    const vid = showcaseVideoRef.current;
    if (!vid) return;

    const playPromise = vid.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, [showcaseVideoIndex, cfg.videoUrls]);

  /* =========================
     AUDIO
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

  /* =========================
     SCROLL
  ========================= */

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  /* =========================
     SHOWCASE PRODUCTS
  ========================= */

  const showcaseItems = useMemo(() => {
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
        (s) =>
          (s + dir + showcaseItems.length) %
          showcaseItems.length
      );
    },
    [showcaseItems.length]
  );

  useEffect(() => {
    if (!cfg.autoPlay || paused || showcaseItems.length < 2)
      return;

    const t = setInterval(
      () => go(1),
      Math.max(1800, cfg.intervalMs)
    );

    return () => clearInterval(t);
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

  const active = showcaseItems[slide];

  /* =========================
     FEATURES
  ========================= */

  const features = [
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />,
      big: "1 سنة",
      small: "ضمان حقيقي",
      glow:
        "hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]",
    },
    {
      icon: <Truck className="w-4 h-4 text-[#00D9FF]" />,
      big: "24-48h",
      small: "شحن سريع جداً",
      glow:
        "hover:shadow-[0_0_20px_rgba(0,217,255,0.3)]",
    },
    {
      icon: (
        <CheckCircle2 className="w-4 h-4 text-[#00A8FF]" />
      ),
      big: "100%",
      small: "منتجات أصلية",
      glow:
        "hover:shadow-[0_0_20px_rgba(0,168,255,0.3)]",
    },
    {
      icon: (
        <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
      ),
      big: "+5,400",
      small: "لاعب يثق بنا",
      glow:
        "hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]",
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
      {/* BACKGROUND */}

      <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" />

      <div className="absolute -top-24 right-1/4 w-[520px] h-[380px] bg-[#00A8FF]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 -left-24 w-[520px] h-[380px] bg-[#00D9FF]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-2">

        {/* =========================
            TOP BADGE
        ========================= */}

        <div className="flex justify-center mb-6">
          <div
            className="
              inline-flex items-center gap-2
              px-3.5 py-1.5
              rounded-full
              panel
              border border-[#00A8FF]/30
              backdrop-blur-md
            "
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A8FF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00A8FF]" />
            </span>

            <span className="text-[11px] sm:text-xs font-bold text-gray-200">
              المتجر الأول لطرفيات الجيمينج الاحترافية في فلسطين
            </span>

            <span
              className="
                text-[9px] sm:text-[10px]
                font-black
                bg-[#00D9FF]
                text-[#00101c]
                px-2 py-0.5
                rounded-full
                font-tech
              "
            >
              CYBER ESPORTS
            </span>
          </div>
        </div>

        {/* =========================
            HERO GRID
        ========================= */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">

          {/* =========================
              RIGHT - TEXT
          ========================= */}

          <div className="lg:col-span-6 space-y-5 text-right">

            <div className="flex items-center gap-4 justify-end">

              <div className="text-right">
                <div className="brand-mark brand-mark-lg text-white">
                  NITRO{" "}
                  <span className="brand-mark-games">
                    GAMES
                  </span>
                </div>

                <div className="brand-sub mt-1">
                  PALESTINE · ESPORTS GEAR
                </div>
              </div>

              <div
                className="
                  relative
                  w-14 h-14
                  sm:w-20 sm:h-20
                  rounded-2xl
                  grad-frame
                  flex items-center justify-center
                  flex-shrink-0
                "
              >
                <Zap
                  className="
                    w-7 h-7
                    sm:w-9 sm:h-9
                    text-[#00A8FF]
                    drop-shadow-[0_0_14px_#00A8FF]
                  "
                />
              </div>

            </div>

            <h1
              className="
                text-2xl
                sm:text-5xl
                lg:text-[3.2rem]
                font-black
                text-white
                leading-[1.25]
                font-['Cairo']
              "
            >
              <span className="brand-mark brand-mark-md text-white">
                NITRO GAMES
              </span>

              <span className="block mt-1">
                <span className="sr-only">
                  نيترو قيمز —
                </span>

                خياركم الأفضل في فلسطين
              </span>

              <span
                className="
                  block
                  text-xl
                  sm:text-4xl
                  lg:text-[2.5rem]
                  text-gray-100
                  mt-1
                "
              >
                للعتاد الاحترافي..{" "}
                <span className="glow-cyan">
                  ارفع مستوى لعبك!
                </span>
              </span>
            </h1>

            <p className="text-xs sm:text-base text-gray-300 max-w-xl leading-relaxed">
              توصيل لكافة مناطق فلسطين والداخل المحتل 🚚 | ضمان حقيقي لمدة سنة على جميع المنتجات ⭐
            </p>

            <div className="flex flex-wrap items-center gap-3">

              <button
                onClick={() => scrollTo("products")}
                className="
                  btn-neon
                  text-xs sm:text-base
                  px-6 sm:px-8
                  py-3 sm:py-3.5
                  flex items-center gap-2
                  cursor-pointer
                  group
                "
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />

                <span>
                  {cfg.ctaLabel || "تسوق الآن"}
                </span>

                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>

            </div>

            {/* FEATURES */}

            <div className="pt-2 overflow-x-auto no-scrollbar">

              <div className="grid grid-cols-4 gap-2 sm:gap-3 min-w-[300px]">

                {features.map((s, i) => (
                  <div
                    key={i}
                    className={`
                      relative
                      group
                      overflow-hidden
                      flex flex-col
                      items-center
                      text-center
                      justify-between
                      p-2 sm:p-3
                      rounded-xl sm:rounded-2xl
                      bg-gradient-to-b
                      from-[#081a30]/90
                      to-[#030d1a]/90
                      border border-[#00A8FF]/30
                      hover:border-[#00D9FF]
                      transition-all
                      duration-300
                      backdrop-blur-md
                      ${s.glow}
                    `}
                  >

                    <div
                      className="
                        absolute
                        top-0
                        inset-x-0
                        h-[2px]
                        bg-gradient-to-r
                        from-transparent
                        via-[#00D9FF]/70
                        to-transparent
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                      "
                    />

                    <div
                      className="
                        p-1 sm:p-2
                        rounded-lg sm:rounded-xl
                        bg-[#00A8FF]/10
                        border border-[#00A8FF]/20
                        group-hover:bg-[#00D9FF]/20
                        group-hover:border-[#00D9FF]/50
                        transition-all
                        duration-300
                        transform
                        group-hover:scale-110
                      "
                    >
                      {s.icon}
                    </div>

                    <div className="mt-1">
                      <span
                        className="
                          text-[11px]
                          sm:text-sm
                          font-black
                          text-white
                          font-tech
                          tracking-tight
                          block
                          leading-tight
                        "
                      >
                        {s.big}
                      </span>

                      <span
                        className="
                          text-[8px]
                          sm:text-[11px]
                          text-gray-300
                          font-medium
                          block
                          mt-0.5
                          whitespace-nowrap
                        "
                      >
                        {s.small}
                      </span>
                    </div>

                  </div>
                ))}

              </div>
            </div>
          </div>

          {/* =========================
              LEFT - LIVE SHOWCASE
          ========================= */}

          <div className="lg:col-span-6 mt-2 lg:mt-0">

            <div
              className="relative group max-w-md mx-auto lg:max-w-none"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >

              {/* AUDIO */}

              {siteAudioUrl && (
                <>
                  <audio
                    ref={audioRef}
                    src={siteAudioUrl}
                    loop
                  />

                  <button
                    onClick={toggleAudio}
                    className={`
                      absolute
                      -top-2
                      -left-2
                      z-40
                      w-8 h-8
                      rounded-full
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-300
                      hover:scale-110
                      border
                      ${
                        isPlaying
                          ? "bg-[#00D9FF] border-[#00D9FF] text-[#00101c] shadow-[0_0_15px_#00D9FF]"
                          : "bg-[#05172b]/95 border-[#00D9FF]/70 text-[#00D9FF] backdrop-blur-md"
                      }
                    `}
                  >
                    {isPlaying ? (
                      <Volume2 className="w-4 h-4 animate-pulse" />
                    ) : (
                      <Music className="w-4 h-4" />
                    )}
                  </button>
                </>
              )}

              {/* =========================
                  CYBER LIVE FRAME
              ========================= */}

              <div
                className="
                  relative
                  rounded-[26px]
                  p-[1px]
                  bg-gradient-to-br
                  from-[#00D9FF]
                  via-[#07558c]
                  to-[#03101d]
                  shadow-[0_0_45px_rgba(0,168,255,0.18)]
                "
              >

                {/* CYBER CORNERS */}

                <div className="
                  absolute
                  -top-[1px]
                  -right-[1px]
                  w-20 h-10
                  border-t-2
                  border-r-2
                  border-[#00D9FF]
                  rounded-tr-[26px]
                  pointer-events-none
                  z-20
                " />

                <div className="
                  absolute
                  -bottom-[1px]
                  -left-[1px]
                  w-20 h-10
                  border-b-2
                  border-l-2
                  border-[#00D9FF]
                  rounded-bl-[26px]
                  pointer-events-none
                  z-20
                " />

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-[25px]
                    bg-[#020914]
                    border border-[#0c385b]
                  "
                >

                  {/* =========================
                      LIVE HEADER
                  ========================= */}

                  <div
                    className="
                      relative
                      flex
                      items-center
                      justify-between
                      px-4
                      sm:px-5
                      py-3
                      bg-gradient-to-r
                      from-[#031426]
                      via-[#082846]
                      to-[#031426]
                      border-b
                      border-[#00A8FF]/30
                    "
                  >

                    <div className="flex items-center gap-2">

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          px-2.5
                          py-1
                          rounded-full
                          bg-red-500/10
                          border border-red-500/30
                        "
                      >
                        <span className="relative flex w-2 h-2">
                          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                          <span className="relative w-2 h-2 rounded-full bg-red-500" />
                        </span>

                        <span className="text-[9px] sm:text-[10px] font-black text-white font-tech tracking-wider">
                          LIVE
                        </span>
                      </div>

                      <div className="hidden sm:block h-5 w-px bg-[#00A8FF]/30" />

                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />

                        <span className="text-[9px] text-gray-300 font-tech">
                          SHOWCASE
                        </span>
                      </div>

                    </div>

                    <div className="flex items-center gap-2">

                      <Sparkles
                        className="
                          w-4 h-4
                          text-[#00D9FF]
                          animate-spin
                        "
                        style={{
                          animationDuration: "6s",
                        }}
                      />

                      <span
                        className="
                          text-sm
                          sm:text-base
                          font-black
                          font-tech
                          text-white
                        "
                      >
                        LIVE{" "}
                        <span className="text-[#00D9FF]">
                          SHOWCASE
                        </span>
                      </span>

                    </div>

                  </div>

                  {/* =========================
                      SHOWCASE CONTENT
                  ========================= */}

                  <div className="relative">

                    {/* VIDEO */}

                    {cfg.enabled &&
                    cfg.videoUrls &&
                    cfg.videoUrls.length > 0 ? (
                      <div className="relative aspect-[16/10] w-full bg-[#010611]">

                        <video
                          ref={showcaseVideoRef}
                          key={
                            cfg.videoUrls[
                              showcaseVideoIndex %
                                cfg.videoUrls.length
                            ]
                          }
                          src={
                            cfg.videoUrls[
                              showcaseVideoIndex %
                                cfg.videoUrls.length
                            ]
                          }
                          autoPlay
                          muted
                          loop={cfg.videoUrls.length === 1}
                          playsInline
                          controls
                          onEnded={() =>
                            setShowcaseVideoIndex(
                              (i) =>
                                (i + 1) %
                                cfg.videoUrls!.length
                            )
                          }
                          className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                          "
                        />

                        {/* DARK GRADIENT */}

                        <div
                          className="
                            absolute
                            inset-0
                            pointer-events-none
                            bg-gradient-to-t
                            from-[#020914]
                            via-transparent
                            to-transparent
                          "
                        />

                        {/* LIVE BADGE */}

                        <div
                          className="
                            absolute
                            top-3
                            right-3
                            z-20
                            flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            bg-[#020914]/85
                            border border-[#00D9FF]/50
                            backdrop-blur-md
                          "
                        >
                          <span className="relative flex w-2 h-2">
                            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
                            <span className="relative w-2 h-2 rounded-full bg-red-500" />
                          </span>

                          <span className="text-[9px] font-black text-white">
                            LIVE
                          </span>
                        </div>

                        {cfg.videoUrls.length > 1 && (
                          <div
                            className="
                              absolute
                              bottom-3
                              right-3
                              z-20
                              px-2.5
                              py-1
                              rounded-lg
                              bg-black/70
                              border border-[#00D9FF]/30
                              text-[#00D9FF]
                              text-[9px]
                              font-tech
                              backdrop-blur-md
                            "
                          >
                            {showcaseVideoIndex + 1}/
                            {cfg.videoUrls.length}
                          </div>
                        )}

                      </div>
                    ) : active ? (

                      /* IMAGE */

                      <div
                        className="
                          relative
                          aspect-[16/10]
                          w-full
                          bg-[#010611]
                        "
                      >

                        <Image
                          src={active.image}
                          alt={active.title}
                          fill
                          priority
                          className="
                            object-contain
                            p-3
                            transition-transform
                            duration-500
                            group-hover:scale-[1.025]
                          "
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-[#020914]
                            via-transparent
                            to-transparent
                            pointer-events-none
                          "
                        />

                        {/* LIVE */}

                        <div
                          className="
                            absolute
                            top-3
                            right-3
                            z-20
                            flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                            bg-[#020914]/90
                            border border-[#00D9FF]/50
                            backdrop-blur-md
                          "
                        >
                          <span className="relative flex w-2 h-2">
                            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping" />
                            <span className="relative w-2 h-2 rounded-full bg-red-500" />
                          </span>

                          <span className="text-[9px] font-black text-white">
                            LIVE
                          </span>
                        </div>

                      </div>

                    ) : null}

                    {/* =========================
                        PRODUCT INFO OVERLAY
                    ========================= */}

                    {active && (
                      <div
                        className="
                          absolute
                          left-3
                          right-3
                          bottom-3
                          z-20
                          flex
                          items-end
                          justify-between
                          gap-3
                          pointer-events-none
                        "
                      >

                        <div
                          className="
                            max-w-[65%]
                            text-right
                            drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                          "
                        >

                          <div
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              mb-1
                              px-2
                              py-0.5
                              rounded-md
                              bg-[#00D9FF]/10
                              border border-[#00D9FF]/30
                              backdrop-blur-md
                            "
                          >
                            <Zap className="w-3 h-3 text-[#00D9FF]" />

                            <span className="text-[8px] sm:text-[9px] text-[#00D9FF] font-tech font-bold">
                              CYBER GEAR
                            </span>
                          </div>

                          <h3 className="
                            text-sm
                            sm:text-lg
                            font-black
                            text-white
                            font-['Cairo']
                            truncate
                          ">
                            {active.title}
                          </h3>

                          <div className="
                            text-base
                            sm:text-xl
                            font-black
                            text-[#00D9FF]
                            font-tech
                          ">
                            {active.price} ₪
                          </div>

                        </div>

                        <button
                          onClick={() =>
                            addToCart(active)
                          }
                          className="
                            pointer-events-auto
                            flex
                            items-center
                            gap-1.5
                            px-3
                            sm:px-4
                            py-2
                            rounded-xl
                            bg-[#00D9FF]
                            text-[#00101c]
                            text-[10px]
                            sm:text-xs
                            font-black
                            shadow-[0_0_20px_rgba(0,217,255,0.35)]
                            hover:scale-105
                            active:scale-95
                            transition-all
                            whitespace-nowrap
                          "
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />

                          أضف للسلة
                        </button>

                      </div>
                    )}

                  </div>

                  {/* =========================
                      PRODUCT FEATURES
                  ========================= */}

                  {active && (
                    <div
                      className="
                        grid
                        grid-cols-3
                        border-t
                        border-[#00A8FF]/20
                        bg-gradient-to-r
                        from-[#031426]
                        via-[#061d34]
                        to-[#031426]
                      "
                    >

                      <div className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-2.5
                        border-l
                        border-[#00A8FF]/20
                      ">
                        <Zap className="w-4 h-4 text-[#00D9FF] mb-1" />

                        <span className="text-[8px] sm:text-[9px] text-gray-300 font-tech">
                          PERFORMANCE
                        </span>
                      </div>

                      <div className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-2.5
                        border-l
                        border-[#00A8FF]/20
                      ">
                        <CheckCircle2 className="w-4 h-4 text-[#00D9FF] mb-1" />

                        <span className="text-[8px] sm:text-[9px] text-gray-300 font-tech">
                          ORIGINAL
                        </span>
                      </div>

                      <div className="
                        flex
                        flex-col
                        items-center
                        justify-center
                        py-2.5
                      ">
                        <ShieldCheck className="w-4 h-4 text-[#00D9FF] mb-1" />

                        <span className="text-[8px] sm:text-[9px] text-gray-300 font-tech">
                          1 YEAR WARRANTY
                        </span>
                      </div>

                    </div>
                  )}

                  {/* =========================
                      THUMBNAILS
                  ========================= */}

                  {showcaseItems.length > 1 && (
                    <div
                      className="
                        relative
                        px-3
                        sm:px-4
                        py-3
                        bg-[#020b17]
                        border-t
                        border-[#00A8FF]/20
                      "
                    >

                      <button
                        onClick={() => go(-1)}
                        className="
                          absolute
                          left-1
                          top-1/2
                          -translate-y-1/2
                          z-20
                          w-7
                          h-7
                          rounded-full
                          flex
                          items-center
                          justify-center
                          bg-[#05172b]
                          border
                          border-[#00D9FF]/40
                          text-[#00D9FF]
                          hover:bg-[#00D9FF]
                          hover:text-[#00101c]
                          transition-all
                        "
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <div
                        className="
                          flex
                          gap-2
                          overflow-hidden
                          mx-7
                        "
                      >

                        {showcaseItems
                          .slice(0, 5)
                          .map((item, i) => (
                            <button
                              key={item.id}
                              onClick={() =>
                                setSlide(i)
                              }
                              className={`
                                relative
                                flex-shrink-0
                                w-[72px]
                                sm:w-[90px]
                                aspect-[4/3]
                                rounded-lg
                                overflow-hidden
                                border
                                transition-all
                                duration-300
                                ${
                                  i === slide
                                    ? "border-[#00D9FF] shadow-[0_0_15px_rgba(0,217,255,0.4)] scale-[1.03]"
                                    : "border-[#0d3655] opacity-70 hover:opacity-100"
                                }
                              `}
                            >

                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />

                              {i === slide && (
                                <div className="
                                  absolute
                                  inset-0
                                  bg-[#00D9FF]/10
                                  ring-1
                                  ring-inset
                                  ring-[#00D9FF]
                                />
                              )}

                            </button>
                          ))}

                      </div>

                      <button
                        onClick={() => go(1)}
                        className="
                          absolute
                          right-1
                          top-1/2
                          -translate-y-1/2
                          z-20
                          w-7
                          h-7
                          rounded-full
                          flex
                          items-center
                          justify-center
                          bg-[#05172b]
                          border
                          border-[#00D9FF]/40
                          text-[#00D9FF]
                          hover:bg-[#00D9FF]
                          hover:text-[#00101c]
                          transition-all
                        "
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                    </div>
                  )}

                  {/* =========================
                      BOTTOM STATUS
                  ========================= */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      px-4
                      py-2.5
                      border-t
                      border-[#00A8FF]/20
                      bg-[#030f1d]
                    "
                  >

                    <div className="flex items-center gap-2">

                      <span className="relative flex w-2 h-2">
                        <span className="absolute inset-0 rounded-full bg-[#00D9FF] animate-ping opacity-70" />
                        <span className="relative w-2 h-2 rounded-full bg-[#00D9FF]" />
                      </span>

                      <span className="
                        text-[8px]
                        sm:text-[9px]
                        font-tech
                        text-gray-400
                      ">
                        NITRO GAMES · CYBER SHOWCASE
                      </span>

                    </div>

                    <button
                      onClick={() =>
                        scrollTo("products")
                      }
                      className="
                        text-[9px]
                        sm:text-[10px]
                        font-bold
                        text-[#00D9FF]
                        hover:text-white
                        transition-colors
                      "
                    >
                      عرض جميع المنتجات ←
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
