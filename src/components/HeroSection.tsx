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

export const HeroSection: React.FC<HeroSectionProps> = ({ products, showcase }) => {
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

  // شريطان متقاطعان على شكل X: كل شريط نصفين متطابقين (حلقة بدون فراغ)
  const ribbonA = [
    { icon: <ShieldCheck className="w-4 h-4" />, text: "ضمان حقيقي لمدة سنة" },
    { icon: <span>⭐</span>, text: "+5,400 لاعب يثق بنا" },
  ];
  const ribbonB = [
    { icon: <Crown className="w-4 h-4" />, text: "الأفضل في فلسطين" },
    { icon: <Truck className="w-4 h-4" />, text: "توصيل لكل المناطق" },
  ];
  const renderRibbonHalf = (items: typeof ribbonA, key: string, hidden: boolean) => (
    <div key={key} className="flex items-center shrink-0" aria-hidden={hidden}>
      {[0, 1, 2].flatMap((r) =>
        items.map((it, i) => (
          <span
            key={`${key}-${r}-${i}`}
            className="flex items-center gap-2 px-5 text-[13px] sm:text-sm font-black font-['Cairo'] whitespace-nowrap"
          >
            {it.icon}
            {it.text}
            <span className="mx-2 opacity-60">✦</span>
          </span>
        ))
      )}
    </div>
  );

  const AudioButton = () =>
    siteAudioUrl ? (
      <button
        onClick={toggleAudio}
        className={`p-2.5 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
          isPlaying
            ? "bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_18px_rgba(0,229,255,0.7)]"
            : "bg-[#09152a] border-[#00a3ff]/40 text-[#00e5ff] hover:border-[#00e5ff]"
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
      <span className="text-[9px] font-tech tracking-widest text-[#3a5a8a] uppercase select-none">
        NITRO · GAMES
      </span>
    );

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-6 pb-16 lg:pt-10 lg:pb-24 bg-[#03060f] border-b border-[#16223a]"
    >
      <style>{`
        @keyframes heroGlow {
          0%, 100% { opacity: 0.28; }
          50% { opacity: 0.5; }
        }
        .hero-glow { animation: heroGlow 5s ease-in-out infinite; }
        @keyframes heroShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .hero-shimmer {
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: heroShimmer 5s linear infinite;
        }
        @keyframes pillSweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        .pill-sweep { animation: pillSweep 4.5s ease-in-out infinite; }
        @property --luxA { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        @keyframes luxSpin { to { --luxA: 360deg; } }
        .lux-frame {
          background: conic-gradient(from var(--luxA), #00e5ff, #0047ff 25%, #04101f 45%, #00a3ff 65%, #00e5ff 85%, #00e5ff);
          animation: luxSpin 7s linear infinite;
        }
        @keyframes heroRise {
          from { opacity: 0; transform: translate3d(0, 22px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        .hero-rise { opacity: 0; animation: heroRise 0.8s cubic-bezier(.2,.7,.2,1) forwards; }
        .d1 { animation-delay: .05s; } .d2 { animation-delay: .18s; } .d3 { animation-delay: .3s; }
        .d4 { animation-delay: .42s; } .d5 { animation-delay: .54s; } .d6 { animation-delay: .66s; }
        .xr-track { display: inline-flex; width: max-content; animation: xrMove 30s linear infinite; }
        .xr-rev { animation-direction: reverse; }
        @keyframes xrMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .btn-sheen { position: relative; overflow: hidden; }
        .btn-sheen::after {
          content: ""; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent);
          transform: skewX(-20deg); animation: btnSheen 3.8s ease-in-out infinite;
        }
        @keyframes btnSheen { 0%, 55% { left: -60%; } 100% { left: 130%; } }
        .hero-title {
          background: linear-gradient(180deg, #ffffff 30%, #9fe9ff 100%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 24px rgba(0,163,255,.35));
        }
        .hero-watermark {
          -webkit-text-stroke: 1px rgba(0,229,255,.10);
          color: transparent;
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-glow, .hero-shimmer, .pill-sweep, .lux-frame, .xr-track, .btn-sheen::after { animation: none !important; }
          .hero-rise { opacity: 1; animation: none !important; }
        }
      `}</style>

      {/* علامة مائية ضخمة خلف المحتوى */}
      <div
        className="hero-watermark pointer-events-none select-none absolute top-6 left-1/2 -translate-x-1/2 font-tech font-black leading-none whitespace-nowrap text-[26vw] lg:text-[16rem] opacity-90"
        dir="ltr"
        aria-hidden="true"
      >
        NITRO
      </div>

      <div className="absolute inset-0 tech-grid opacity-70 pointer-events-none" />
      <div
        className="absolute -top-20 right-0 w-[560px] h-[420px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,163,255,0.16), transparent 65%)" }}
      />
      <div
        className="absolute bottom-0 -left-24 w-[560px] h-[420px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,229,255,0.12), transparent 65%)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-7">
        {/* البنر العلوي: خط ضوئي يدور حواليه */}
        <div className="flex justify-center hero-rise d1">
          <div className="lux-frame p-[2px] rounded-full max-w-full shadow-[0_0_28px_rgba(0,163,255,0.3)]">
            <div className="relative overflow-hidden flex items-center gap-3 rounded-full bg-[#060c18] px-3 py-2 sm:px-4">
              <span className="relative shrink-0 bg-[#00a3ff]/15 border border-[#00a3ff]/50 text-[#00e5ff] px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase font-tech whitespace-nowrap">
                CYBER ESPORTS
              </span>
              <p className="relative text-white text-[12px] sm:text-sm font-bold leading-snug">
                أفضل سعر في فلسطين
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* --- النصوص --- */}
          <div className="lg:col-span-6 space-y-5 text-right">
            <div className="flex items-center gap-4 justify-start hero-rise d2">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl grad-frame flex items-center justify-center shrink-0">
                <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-[#00a3ff] drop-shadow-[0_0_12px_#00a3ff]" />
              </div>
              <div className="text-right">
                <div className="brand-mark brand-mark-lg text-white" dir="ltr">
                  NITRO{" "}
                  <span
                    className="brand-mark-games hero-shimmer"
                    style={{
                      backgroundImage:
                        "linear-gradient(100deg, #00a3ff 0%, #00e5ff 25%, #d6f7ff 50%, #00e5ff 75%, #00a3ff 100%)",
                    }}
                  >
                    GAMES
                  </span>
                </div>
                <div className="brand-sub mt-1" dir="ltr">PALESTINE · ESPORTS GEAR</div>
              </div>
            </div>

            <h1 className="font-['Cairo'] leading-[1.35] hero-rise d3">
              <span className="sr-only">نيترو قيمز — </span>
              <span className="hero-title block text-4xl sm:text-5xl lg:text-[3.3rem] font-black">
                خياركم الأفضل في فلسطين
              </span>
              <span className="block text-xl sm:text-3xl lg:text-[2.1rem] text-gray-200 mt-1 font-light">
                للعتاد الاحترافي..{" "}
                <span className="glow-cyan font-bold">ارفع مستوى لعبك!</span>
              </span>
            </h1>

            <div className="flex flex-wrap items-center justify-start gap-3 pt-1 hero-rise d4">
              <button
                onClick={() => scrollTo("products")}
                className="btn-sheen text-sm sm:text-base px-6 py-2.5 rounded-xl font-black text-[#02121f] bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] shadow-[0_0_22px_rgba(0,229,255,0.5)] hover:shadow-[0_0_32px_rgba(0,229,255,0.8)] hover:scale-[1.03] transition-all duration-300 flex items-center gap-2 cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cfg.ctaLabel || "تسوق الآن"}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>

              <div
                dir="ltr"
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#020a17] via-[#091b3a] to-[#020a17] border border-[#00a3ff]/50 shadow-[0_0_18px_rgba(0,163,255,0.2)]"
              >
                <Crown className="w-4 h-4 text-[#00e5ff] fill-[#00a3ff]/30" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                  STORE OWNER:
                </span>
                <span className="text-sm font-black text-[#00e5ff] tracking-widest font-mono">YamEn</span>
                <Sparkles className="w-3.5 h-3.5 text-[#00a3ff]" />
              </div>
            </div>

            {/* شريطان متقاطعان (X) متحركان بعكس بعض */}
            <div className="relative w-full h-[132px] sm:h-[150px] overflow-hidden rounded-2xl hero-rise d5 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]" dir="ltr">
              <div
                className="absolute left-[-15%] w-[130%] top-1/2 -mt-[24px] z-0 origin-center"
                style={{ transform: "rotate(6deg)" }}
              >
                <div className="overflow-hidden border-y border-[#00e5ff]/40 bg-[#07122a]/90 text-[#9fe9ff] shadow-[0_0_24px_rgba(0,163,255,0.25)] py-3">
                  <div className="xr-track xr-rev">
                    {renderRibbonHalf(ribbonB, "b1", false)}
                    {renderRibbonHalf(ribbonB, "b2", true)}
                  </div>
                </div>
              </div>
              <div
                className="absolute left-[-15%] w-[130%] top-1/2 -mt-[24px] z-10 origin-center"
                style={{ transform: "rotate(-6deg)" }}
              >
                <div className="overflow-hidden bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] text-[#02121f] shadow-[0_0_30px_rgba(0,163,255,0.55)] py-3">
                  <div className="xr-track">
                    {renderRibbonHalf(ribbonA, "a1", false)}
                    {renderRibbonHalf(ribbonA, "a2", true)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- المربع المميز --- */}
          <div className="lg:col-span-6 hero-rise d6">
            {cfg.enabled && cfg.videoUrls && cfg.videoUrls.length > 0 ? (
              <div className="relative">
                <div className="hero-glow absolute -inset-1 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] rounded-3xl blur-lg" />

                <div className="lux-frame relative p-[2px] rounded-3xl">
                  <div className="relative rounded-[22px] bg-[#040814] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      <AudioButton />
                      <span className="text-[10px] font-tech font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30">
                        <Radio className="w-3.5 h-3.5 animate-pulse" /> {cfg.badgeText}
                      </span>
                    </div>

                    <div className="relative h-60 sm:h-72 w-full bg-[#030712] p-2">
                      <div className="relative w-full h-full rounded-xl overflow-hidden border border-[#00a3ff]/25">
                        <video
                          ref={showcaseVideoRef}
                          key={cfg.videoUrls[showcaseVideoIndex % cfg.videoUrls.length]}
                          src={cfg.videoUrls[showcaseVideoIndex % cfg.videoUrls.length]}
                          autoPlay
                          muted
                          loop={cfg.videoUrls.length === 1}
                          playsInline
                          controls
                          onEnded={() => setShowcaseVideoIndex((i) => (i + 1) % cfg.videoUrls!.length)}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="px-4 py-3 border-t border-[#142342] bg-[#060c1d] flex items-center justify-between gap-3">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo']">
                        {cfg.headline}
                      </h3>
                      <a
                        href="#products"
                        className="flex items-center gap-2 whitespace-nowrap rounded-xl text-[11px] font-black px-4 py-2 text-[#02121f] bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] shadow-[0_0_16px_rgba(0,229,255,0.45)] hover:shadow-[0_0_26px_rgba(0,229,255,0.8)] transition-all"
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
                className="relative"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div className="hero-glow absolute -inset-1 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] rounded-3xl blur-lg" />

                <div className="lux-frame relative p-[2px] rounded-3xl">
                  <div className="rounded-[22px] bg-[#040814] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      <AudioButton />
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tech font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30">
                          <Flame className="w-3.5 h-3.5 fill-[#00a3ff]/40 animate-pulse" /> {cfg.badgeText}
                        </span>
                        <div className="flex items-center gap-1.5 mr-1">
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
                          className="object-contain p-5"
                        />
                      </div>
                      <div className="absolute top-4 left-4 flex flex-col items-start gap-1">
                        {active.originalPrice && (
                          <span className="text-[11px] font-mono text-gray-400 line-through bg-black/70 px-2 py-0.5 rounded-md">
                            {active.originalPrice.toLocaleString()} ₪
                          </span>
                        )}
                        <span className="text-base font-black font-mono text-[#02121f] bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] px-3 py-1 rounded-lg shadow-[0_0_18px_rgba(0,163,255,0.5)]">
                          {active.price.toLocaleString()} ₪
                        </span>
                      </div>
                      <span className="absolute bottom-4 right-4 text-[10px] font-bold font-tech text-[#00e5ff] bg-[#061124]/90 border border-[#00e5ff]/50 px-3 py-1 rounded-full">
                        {CATEGORIES_META.find((c) => c.id === active.category)?.name ?? active.category}
                      </span>
                    </div>

                    <div className="px-4 py-3 border-t border-[#142342] bg-[#060c1d] flex items-center justify-between gap-3">
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
                        className="flex items-center gap-2 cursor-pointer whitespace-nowrap rounded-xl text-[11px] font-black px-4 py-2 text-[#02121f] bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] shadow-[0_0_16px_rgba(0,229,255,0.45)] hover:shadow-[0_0_26px_rgba(0,229,255,0.8)] transition-all"
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
                <Zap className="w-10 h-10 text-[#00a3ff]/40" />
                <p className="text-xs text-gray-400">المربع المميز معطّل حالياً من لوحة التحكم</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
