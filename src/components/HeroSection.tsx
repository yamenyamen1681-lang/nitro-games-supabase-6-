"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Sparkles,
  Flame,
  Music,
  Volume2,
  Crown,
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

  const [siteAudioUrl, setSiteAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const [showcaseVideoIndex, setShowcaseVideoIndex] = useState(0);
  const showcaseVideoRef = React.useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const vid = showcaseVideoRef.current;

    if (!vid) return;

    const playPromise = vid.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        /* Autoplay can still be blocked */
      });
    }
  }, [showcaseVideoIndex, cfg.videoUrls]);

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
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Resolve showcase items
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
        (s) =>
          (s + dir + showcaseItems.length) %
          showcaseItems.length
      );
    },
    [showcaseItems.length]
  );

  useEffect(() => {
    if (
      !cfg.autoPlay ||
      paused ||
      showcaseItems.length < 2
    ) {
      return;
    }

    const t = setInterval(
      () => go(1),
      Math.max(1200, cfg.intervalMs)
    );

    return () => clearInterval(t);
  }, [
    cfg.autoPlay,
    cfg.intervalMs,
    paused,
    go,
    showcaseItems.length,
  ]);

  // Keep index in range
  useEffect(() => {
    if (slide >= showcaseItems.length) {
      setSlide(0);
    }
  }, [showcaseItems.length, slide]);

  const active = showcaseItems[slide];

  return (
    <section
      id="hero"
      className="
        relative
        overflow-hidden
        pt-10
        pb-16
        lg:pt-14
        lg:pb-24
        bg-[#020914]
        border-b
        border-[#12304a]
      "
    >
      {/* TECH GRID */}
      <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" />

      {/* BLUE GLOW */}
      <div
        className="
          absolute
          -top-24
          right-1/4
          w-[520px]
          h-[380px]
          bg-[#00A8FF]/10
          blur-[130px]
          rounded-full
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-0
          -left-24
          w-[520px]
          h-[380px]
          bg-[#00D9FF]/10
          blur-[130px]
          rounded-full
          pointer-events-none
        "
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ===================================================== */}
        {/* TOP BADGE */}
        {/* ===================================================== */}

        <div className="flex justify-center mb-8">
          <div
            className="
              inline-flex
              items-center
              gap-2.5
              px-4
              py-1.5
              rounded-full
              panel
              border
              border-[#00A8FF]/30
            "
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="
                  animate-ping
                  absolute
                  inline-flex
                  h-full
                  w-full
                  rounded-full
                  bg-[#00A8FF]
                  opacity-75
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  rounded-full
                  h-2.5
                  w-2.5
                  bg-[#00A8FF]
                "
              />
            </span>

            <span className="text-[11px] sm:text-xs font-bold text-gray-200">
              المتجر الأول لطرفيات الجيمينج الاحترافية في فلسطين
            </span>

            <span
              className="
                text-[10px]
                font-black
                bg-[#00D9FF]
                text-[#00101c]
                px-2
                py-0.5
                rounded-full
                font-tech
              "
            >
              CYBER ESPORTS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* ===================================================== */}
          {/* RIGHT: COPY */}
          {/* ===================================================== */}

          <div className="lg:col-span-6 space-y-6 text-right">

            {/* BRAND */}
            <div className="flex items-center gap-4 justify-end">
              <div className="text-right">

                <div className="brand-mark brand-mark-lg text-white">
                  NITRO{" "}
                  <span className="brand-mark-games">
                    GAMES
                  </span>
                </div>

                <div className="brand-sub mt-2">
                  PALESTINE · ESPORTS GEAR
                </div>
              </div>

              <div
                className="
                  relative
                  w-16
                  h-16
                  sm:w-20
                  sm:h-20
                  rounded-2xl
                  grad-frame
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                <Zap
                  className="
                    w-8
                    h-8
                    sm:w-9
                    sm:h-9
                    text-[#00A8FF]
                    drop-shadow-[0_0_14px_#00A8FF]
                  "
                />
              </div>
            </div>

            {/* MAIN TITLE */}
            <h1
              className="
                text-3xl
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

              <span className="block mt-2">
                <span className="sr-only">
                  نيترو قيمز —
                </span>

                خياركم الأفضل في فلسطين
              </span>

              <span
                className="
                  block
                  text-2xl
                  sm:text-4xl
                  lg:text-[2.5rem]
                  text-gray-100
                  mt-1.5
                "
              >
                للعتاد الاحترافي..{" "}
                <span className="glow-cyan">
                  ارفع مستوى لعبك!
                </span>
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
              توصيل لكافة مناطق فلسطين والداخل المحتل 🚚 | ضمان حقيقي لمدة سنة على جميع المنتجات ⭐
            </p>

            {/* STORE OWNER */}
            <div
              className="
                inline-flex
                items-center
                gap-2.5
                px-4
                py-2
                rounded-full
                panel
                border
                border-[#00A8FF]/40
              "
            >
              <Crown className="w-4 h-4 text-[#00D9FF]" />

              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-tech
                  text-gray-300
                  tracking-wide
                "
                dir="ltr"
              >
                STORE OWNER:
              </span>

              <span
                className="
                  text-[11px]
                  sm:text-xs
                  font-black
                  text-[#00D9FF]
                "
                dir="ltr"
              >
                YamEn
              </span>

              <Sparkles className="w-3.5 h-3.5 text-[#00A8FF]" />
            </div>

            {/* BUTTONS */}
            <div className="flex flex-wrap items-center gap-3.5">

              <button
                onClick={() => scrollTo("products")}
                className="
                  btn-neon
                  text-sm
                  sm:text-base
                  px-7
                  py-3.5
                  flex
                  items-center
                  gap-2.5
                  cursor-pointer
                  group
                "
              >
                <ShoppingBag className="w-5 h-5" />

                <span>
                  {cfg.ctaLabel || "تسوق الآن"}
                </span>

                <ArrowLeft
                  className="
                    w-4
                    h-4
                    group-hover:-translate-x-1
                    transition-transform
                  "
                />
              </button>

              <button
                onClick={() => scrollTo("categories")}
                className="
                  btn-ghost
                  text-sm
                  sm:text-base
                  px-6
                  py-3.5
                  flex
                  items-center
                  gap-2
                  cursor-pointer
                "
              >
                <Sparkles className="w-4 h-4 text-[#00D9FF]" />

                <span>
                  الأقسام الخمسة
                </span>
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {[
                {
                  icon: (
                    <span className="text-[#00A8FF]">
                      ⭐
                    </span>
                  ),
                  big: "+5,400",
                  small: "لاعب يثق بنا",
                },

                {
                  icon: (
                    <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />
                  ),
                  big: "1 سنة",
                  small: "ضمان حقيقي",
                },

                {
                  icon: (
                    <CheckCircle2 className="w-4 h-4 text-[#00A8FF]" />
                  ),
                  big: "100%",
                  small: "أصلي معتمد",
                },

                {
                  icon: (
                    <Truck className="w-4 h-4 text-[#00D9FF]" />
                  ),
                  big: "24-48h",
                  small: "شحن سريع",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="
                    panel
                    rounded-xl
                    px-3
                    py-2.5
                    text-right
                  "
                >
                  <div
                    className="
                      text-base
                      font-black
                      text-white
                      font-tech
                      flex
                      items-center
                      justify-end
                      gap-1.5
                    "
                  >
                    {s.big}
                    {s.icon}
                  </div>

                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {s.small}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ===================================================== */}
          {/* LEFT: SHOWCASE */}
          {/* ===================================================== */}

          <div className="lg:col-span-6">

            {/* ================================================= */}
            {/* VIDEO SHOWCASE */}
            {/* ================================================= */}

            {cfg.enabled &&
            cfg.videoUrls &&
            cfg.videoUrls.length > 0 ? (
              <div className="relative">

                <div
                  className="
                    absolute
                    -inset-6
                    bg-gradient-to-tr
                    from-[#00A8FF]/15
                    via-transparent
                    to-[#00D9FF]/15
                    blur-2xl
                    rounded-full
                    pointer-events-none
                  "
                />

                <div className="relative grad-frame p-1.5">

                  <div
                    className="
                      rounded-[16px]
                      bg-[#06111f]
                      overflow-hidden
                    "
                  >

                    {/* VIDEO TOP BAR */}
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        px-4
                        py-2.5
                        border-b
                        border-[#12304a]
                        bg-[#06111f]
                      "
                    >
                      <span
                        className="
                          text-[10px]
                          font-tech
                          text-[#00D9FF]
                          flex
                          items-center
                          gap-1
                        "
                      >
                        <Flame className="w-3 h-3" />

                        {cfg.badgeText}
                      </span>

                      <span
                        className="
                          text-[10px]
                          font-bold
                          text-transparent
                          bg-clip-text
                          bg-gradient-to-l
                          from-[#00A8FF]
                          to-[#00D9FF]
                          font-['Cairo']
                          tracking-wide
                        "
                        dir="ltr"
                      >
                        Store Owner ⚡ 𝓨𝓪𝓶𝓔𝓷 ⚡
                      </span>
                    </div>

                    {/* VIDEO */}
                    <div
                      className="
                        relative
                        h-64
                        sm:h-80
                        w-full
                        bg-black
                        p-2
                      "
                    >
                      <div
                        className="
                          relative
                          w-full
                          h-full
                          rounded-2xl
                          overflow-hidden
                        "
                      >
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
                          loop={
                            cfg.videoUrls.length === 1
                          }
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
                            rounded-2xl
                          "
                        />

                        {/* VIDEO NUMBER */}
                        {cfg.videoUrls.length > 1 && (
                          <span
                            className="
                              absolute
                              top-3
                              left-3
                              z-10
                              text-[10px]
                              font-tech
                              bg-black/70
                              text-[#00D9FF]
                              px-2
                              py-0.5
                              rounded-md
                              border
                              border-[#00D9FF]/30
                            "
                          >
                            {(showcaseVideoIndex %
                              cfg.videoUrls.length) +
                              1}
                            /
                            {cfg.videoUrls.length}
                          </span>
                        )}

                        {/* BLUE OVERLAY */}
                        <span
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-b
                            from-[#00A8FF]/10
                            via-transparent
                            to-[#00A8FF]/15
                            pointer-events-none
                            mix-blend-overlay
                            rounded-2xl
                          "
                        />

                        {/* BLUE BORDER */}
                        <span
                          className="
                            absolute
                            inset-0
                            ring-1
                            ring-inset
                            ring-[#00A8FF]/50
                            rounded-2xl
                            pointer-events-none
                            shadow-[inset_0_0_25px_rgba(0,168,255,0.25)]
                          "
                        />
                      </div>
                    </div>

                    {/* VIDEO BOTTOM */}
                    <div
                      className="
                        px-4
                        py-3.5
                        border-t
                        border-[#12304a]
                        bg-[#06111f]
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <h3
                        className="
                          text-xs
                          sm:text-sm
                          font-bold
                          text-white
                          truncate
                          font-['Cairo']
                        "
                      >
                        {cfg.headline}
                      </h3>

                      <a
                        href="#products"
                        className="
                          btn-neon
                          text-[11px]
                          px-3.5
                          py-2
                          flex
                          items-center
                          gap-1.5
                          cursor-pointer
                          whitespace-nowrap
                        "
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />

                        <span>
                          {cfg.ctaLabel}
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

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
                        -top-4
                        left-6
                        z-10
                        w-9
                        h-9
                        rounded-full
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        transition-all
                        hover:scale-110
                        ${
                          isPlaying
                            ? "bg-[#00A8FF] text-[#00101c]"
                            : "bg-[#06111f] border border-[#00A8FF]/50 text-[#00A8FF]"
                        }
                      `}
                      title={
                        isPlaying
                          ? "إيقاف الموسيقى"
                          : "تشغيل موسيقى الموقع"
                      }
                    >
                      {isPlaying ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <Music className="w-4 h-4" />
                      )}
                    </button>
                  </>
                )}

                {/* FLOATING INFO */}
                <div
                  className="
                    hidden
                    sm:flex
                    absolute
                    -bottom-4
                    right-6
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-xl
                    panel
                    border
                    border-[#00A8FF]/40
                    animate-floaty
                  "
                >
                  <Zap className="w-3.5 h-3.5 text-[#00A8FF]" />

                  <span className="text-[10px] font-bold text-gray-200">
                    {cfg.headline}
                  </span>
                </div>
              </div>

            ) : cfg.enabled && active ? (

              /* ================================================= */
              /* PRODUCT SHOWCASE */
              /* ================================================= */

              <div
                className="relative"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >

                {/* BLUE GLOW */}
                <div
                  className="
                    absolute
                    -inset-6
                    bg-gradient-to-tr
                    from-[#00A8FF]/15
                    via-transparent
                    to-[#00D9FF]/15
                    blur-2xl
                    rounded-full
                    pointer-events-none
                  "
                />

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
                        -top-4
                        left-6
                        z-10
                        w-9
                        h-9
                        rounded-full
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        transition-all
                        hover:scale-110
                        ${
                          isPlaying
                            ? "bg-[#00A8FF] text-[#00101c]"
                            : "bg-[#06111f] border border-[#00A8FF]/50 text-[#00A8FF]"
                        }
                      `}
                      title={
                        isPlaying
                          ? "إيقاف الموسيقى"
                          : "تشغيل موسيقى الموقع"
                      }
                    >
                      {isPlaying ? (
                        <Volume2 className="w-4 h-4" />
                      ) : (
                        <Music className="w-4 h-4" />
                      )}
                    </button>
                  </>
                )}

                <div className="relative grad-frame p-1.5">

                  <div
                    className="
                      rounded-[16px]
                      bg-[#06111f]
                      overflow-hidden
                    "
                  >

                    {/* TOP BAR */}
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        px-4
                        py-2.5
                        border-b
                        border-[#12304a]
                        bg-[#06111f]
                      "
                    >

                      {/* SLIDER DOTS */}
                      <div className="flex items-center gap-1.5">

                        {showcaseItems.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setSlide(i)}
                            aria-label={`صورة ${i + 1}`}
                            className={`
                              h-1.5
                              rounded-full
                              transition-all
                              cursor-pointer
                              ${
                                i === slide
                                  ? "w-6 bg-[#00A8FF]"
                                  : "w-1.5 bg-[#16415d]"
                              }
                            `}
                          />
                        ))}
                      </div>

                      {/* CONTROLS */}
                      <div className="flex items-center gap-2">

                        <span
                          className="
                            text-[10px]
                            font-tech
                            text-[#00D9FF]
                            flex
                            items-center
                            gap-1
                          "
                        >
                          <Flame className="w-3 h-3" />

                          {cfg.badgeText}
                        </span>

                        <button
                          onClick={() => go(-1)}
                          className="
                            p-1
                            rounded-lg
                            bg-[#0b1b2d]
                            hover:bg-[#00A8FF]
                            hover:text-[#00101c]
                            text-gray-300
                            transition-colors
                            cursor-pointer
                          "
                          aria-label="السابق"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => go(1)}
                          className="
                            p-1
                            rounded-lg
                            bg-[#0b1b2d]
                            hover:bg-[#00A8FF]
                            hover:text-[#00101c]
                            text-gray-300
                            transition-colors
                            cursor-pointer
                          "
                          aria-label="التالي"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* IMAGE */}
                    <div
                      className="
                        relative
                        h-64
                        sm:h-80
                        w-full
                        bg-gradient-to-b
                        from-[#061321]
                        to-[#020914]
                      "
                    >

                      <div
                        key={active.id}
                        className="
                          absolute
                          inset-0
                          showcase-enter
                        "
                      >
                        <Image
                          src={active.image}
                          alt={active.title}
                          fill
                          priority
                          className="object-contain p-6"
                        />
                      </div>

                      {/* CORNER FRAME */}
                      <span
                        className="
                          absolute
                          top-3
                          right-3
                          w-5
                          h-5
                          border-t-2
                          border-r-2
                          border-[#00A8FF]/60
                          rounded-tr-md
                        "
                      />

                      <span
                        className="
                          absolute
                          bottom-3
                          left-3
                          w-5
                          h-5
                          border-b-2
                          border-l-2
                          border-[#00D9FF]/60
                          rounded-bl-md
                        "
                      />

                      {/* PRICE */}
                      <div
                        className="
                          absolute
                          top-3
                          left-3
                          flex
                          flex-col
                          items-start
                          gap-1.5
                        "
                      >

                        {active.originalPrice && (
                          <span
                            className="
                              text-[10px]
                              font-mono
                              text-gray-400
                              line-through
                              bg-black/60
                              px-2
                              py-0.5
                              rounded
                            "
                          >
                            {active.originalPrice.toLocaleString()} ₪
                          </span>
                        )}

                        <span
                          className="
                            text-lg
                            font-black
                            font-mono
                            text-[#00101c]
                            bg-[#00A8FF]
                            px-2.5
                            py-1
                            rounded-lg
                            shadow-[0_0_20px_rgba(0,168,255,0.5)]
                          "
                        >
                          {active.price.toLocaleString()} ₪
                        </span>
                      </div>

                      {/* CATEGORY */}
                      <span
                        className="
                          absolute
                          bottom-3
                          right-3
                          text-[10px]
                          font-bold
                          font-tech
                          text-[#00D9FF]
                          bg-black/70
                          border
                          border-[#00D9FF]/40
                          px-2.5
                          py-1
                          rounded-full
                        "
                      >
                        {
                          CATEGORIES_META.find(
                            (c) =>
                              c.id === active.category
                          )?.name ??
                            active.category
                        }
                      </span>
                    </div>

                    {/* BOTTOM INFO */}
                    <div
                      className="
                        px-4
                        py-3.5
                        border-t
                        border-[#12304a]
                        bg-[#06111f]
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >

                      <div className="min-w-0 text-right">

                        <div
                          className="
                            text-[10px]
                            font-tech
                            text-[#00A8FF]
                            uppercase
                          "
                        >
                          {active.brand}
                        </div>

                        <h3
                          className="
                            text-xs
                            sm:text-sm
                            font-bold
                            text-white
                            truncate
                            font-['Cairo']
                          "
                        >
                          {active.title}
                        </h3>
                      </div>

                      <button
                        onClick={() =>
                          addToCart(active, 1)
                        }
                        className="
                          btn-neon
                          text-[11px]
                          px-3.5
                          py-2
                          flex
                          items-center
                          gap-1.5
                          cursor-pointer
                          whitespace-nowrap
                        "
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />

                        <span>
                          أضف للسلة
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* FLOATING INFO */}
                <div
                  className="
                    hidden
                    sm:flex
                    absolute
                    -bottom-4
                    right-6
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-xl
                    panel
                    border
                    border-[#00A8FF]/40
                    animate-floaty
                  "
                >
                  <Zap className="w-3.5 h-3.5 text-[#00A8FF]" />

                  <span className="text-[10px] font-bold text-gray-200">
                    {cfg.headline}
                  </span>
                </div>
              </div>

            ) : (

              /* ================================================= */
              /* DISABLED SHOWCASE */
              /* ================================================= */

              <div
                className="
                  panel
                  rounded-2xl
                  h-64
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  text-center
                "
              >
                <Zap className="w-10 h-10 text-[#00A8FF]/40" />

                <p className="text-xs text-gray-400">
                  المربع المميز معطّل حالياً من لوحة التحكم
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================== */}
        {/* 5 CATEGORIES */}
        {/* ===================================================== */}

        <div
          id="hero-categories"
          className="pt-12"
        >

          <div
            className="
              text-[11px]
              font-tech
              text-gray-400
              uppercase
              tracking-[0.2em]
              mb-3.5
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span
              className="
                w-10
                h-px
                bg-gradient-to-l
                from-[#00A8FF]/50
                to-transparent
              "
            />

            الأقسام الخمسة

            <span
              className="
                w-10
                h-px
                bg-gradient-to-r
                from-[#00D9FF]/50
                to-transparent
              "
            />
          </div>

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-3
              lg:grid-cols-5
              gap-3
            "
          >
            {CATEGORIES_META.map((c, i) => {

              const count = products.filter(
                (p) => p.category === c.id
              ).length;

              return (
                <button
                  key={c.id}
                  onClick={() => {
                    onCategorySelect?.(c.id);
                    scrollTo("products");
                  }}
                  className="
                    group
                    panel
                    rounded-2xl
                    px-4
                    py-4
                    text-right
                    cursor-pointer
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div>

                    <div
                      className="
                        text-sm
                        font-black
                        text-white
                        group-hover:text-[#00A8FF]
                        transition-colors
                        font-['Cairo']
                      "
                    >
                      {c.name}
                    </div>

                    <div
                      className="
                        text-[10px]
                        text-gray-400
                        font-tech
                        mt-0.5
                      "
                    >
                      {count} منتج
                    </div>
                  </div>

                  <span
                    className={`
                      w-9
                      h-9
                      rounded-xl
                      flex
                      items-center
                      justify-center
                      text-xs
                      font-tech
                      group-hover:scale-110
                      transition-transform
                      ${
                        i % 2 === 0
                          ? "bg-[#00A8FF]/10 text-[#00A8FF] border border-[#00A8FF]/30"
                          : "bg-[#00D9FF]/10 text-[#00D9FF] border border-[#00D9FF]/30"
                      }
                    `}
                  >
                    0{i + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
