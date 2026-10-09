"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Product, ShowcaseConfig, DEFAULT_SHOWCASE } from "@/lib/data";
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
  Disc,
  VolumeX,
  Crown,
  Radio,
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
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [showcaseVideoIndex, setShowcaseVideoIndex] = useState(0);
  const showcaseVideoRef = React.useRef<HTMLVideoElement | null>(null);

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

  // ---------- الشريط المتحرك: محرّك JS مباشر (requestAnimationFrame) ----------
  // بدل الاعتماد على CSS keyframes ونسب مئوية قابلة للخطأ، هون بنحرّك
  // الشريط فريم-فريم بالـJS، ومدّة "الدورة" (period) بتتقاس مباشرة من
  // المسافة الحقيقية بين أول كرت وأول كرت بالتكرار التالي داخل الـDOM
  // الفعلي. بما إنه عدد النسخ المكرر كبير (8)، دايمًا في محتوى كافي
  // يغطي أي عرض شاشة، فما ينفد الشريط ولا يبين فراغ أبدًا — وبما إنه
  // الإزاحة بترجع "تلف" (modulo) بالضبط على طول نسخة وحدة، الحركة
  // بتضل متصلة للأبد بدون أي قطع.
  const TICKER_SPEED_PX_PER_SEC = 50;
  const TICKER_REPEAT = 8;

  const stats = [
    { icon: <span className="text-[#00e5ff]">⭐</span>, big: "+5,400", small: "لاعب يثق بنا" },
    { icon: <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />, big: "1 سنة", small: "ضمان حقيقي" },
    { icon: <CheckCircle2 className="w-4 h-4 text-[#00a3ff]" />, big: "100%", small: "أصلي معتمد" },
    { icon: <Truck className="w-4 h-4 text-[#00e5ff]" />, big: "24-48h", small: "شحن سريع" },
  ];

  const tickerOuterRef = React.useRef<HTMLDivElement>(null);
  const tickerTrackRef = React.useRef<HTMLDivElement>(null);
  const tickerPeriodRef = React.useRef<number>(0);
  const tickerOffsetRef = React.useRef<number>(0);
  const tickerRafRef = React.useRef<number | undefined>(undefined);
  const tickerLastTsRef = React.useRef<number | null>(null);

  useEffect(() => {
    const track = tickerTrackRef.current;
    if (!track) return;

    const measurePeriod = () => {
      const items = track.querySelectorAll<HTMLElement>("[data-ticker-item]");
      if (items.length > stats.length) {
        const first = items[0].getBoundingClientRect().left;
        const next = items[stats.length].getBoundingClientRect().left;
        const period = Math.abs(next - first);
        if (period > 0) tickerPeriodRef.current = period;
      }
    };

    measurePeriod();
    const ro = new ResizeObserver(measurePeriod);
    ro.observe(track);
    window.addEventListener("resize", measurePeriod);

    const step = (ts: number) => {
      if (tickerLastTsRef.current == null) tickerLastTsRef.current = ts;
      const dt = Math.min(0.05, (ts - tickerLastTsRef.current) / 1000);
      tickerLastTsRef.current = ts;

      const period = tickerPeriodRef.current;
      if (period > 0 && tickerTrackRef.current) {
        tickerOffsetRef.current += TICKER_SPEED_PX_PER_SEC * dt;
        if (tickerOffsetRef.current >= period) {
          tickerOffsetRef.current -= period;
        }
        tickerTrackRef.current.style.transform = `translateX(-${tickerOffsetRef.current}px)`;
      }
      tickerRafRef.current = requestAnimationFrame(step);
    };
    tickerRafRef.current = requestAnimationFrame(step);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measurePeriod);
      if (tickerRafRef.current) cancelAnimationFrame(tickerRafRef.current);
      tickerLastTsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // عنصر الكارت نفسه — data-ticker-item تُستخدم فقط لقياس طول "دورة" واحدة
  const renderStatCard = (s: (typeof stats)[number], key: string) => (
    <div
      key={key}
      data-ticker-item
      className="inline-flex items-center gap-3 bg-gradient-to-r from-[#071124] to-[#040914] border border-[#00a3ff]/40 hover:border-[#00e5ff]/70 rounded-2xl px-4 py-3 shrink-0 shadow-[0_4px_20px_rgba(0,163,255,0.15)] transition-colors duration-300"
    >
      <div className="text-sm font-black text-[#00e5ff] font-tech flex items-center gap-1.5 bg-[#00a3ff]/15 px-2.5 py-1 rounded-xl border border-[#00a3ff]/30">
        {s.big} {s.icon}
      </div>
      <div className="text-xs text-gray-200 font-bold font-['Cairo'] pr-2 border-r border-[#00a3ff]/30">
        {s.small}
      </div>
    </div>
  );

  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-20 lg:pt-14 lg:pb-28 bg-[#03060f] border-b border-[#16223a]">
      <style>{`
        @keyframes cyberGlow {
          0%, 100% { opacity: 0.45; filter: drop-shadow(0 0 14px rgba(0, 163, 255, 0.35)); }
          50% { opacity: 0.85; filter: drop-shadow(0 0 24px rgba(0, 229, 255, 0.65)); }
        }
        .animate-cyber-glow {
          animation: cyberGlow 5s infinite ease-in-out;
        }

        @keyframes shimmerSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-blue {
          background-size: 220% auto;
          animation: shimmerSweep 4.5s linear infinite;
        }
      `}</style>

      {/* خلفية تفاعلية */}
      <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-[520px] h-[380px] bg-[#00a3ff]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[520px] h-[380px] bg-[#00e5ff]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

        {/* شارة التأسيس العلوية */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-[#00a3ff]/25 bg-[#00a3ff]/[0.04] backdrop-blur-sm shadow-[0_0_20px_rgba(0,163,255,0.1)] text-center">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a3ff] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a3ff]" />
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-gray-300 tracking-wide">
              المتجر الأول لطرفيات الجيمينج الاحترافية في فلسطين
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* --- القسم الأيمن: النصوص ومعلومات صاحب المتجر والشريط المتحرك --- */}
          <div className="lg:col-span-6 space-y-7 text-right">
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
                <div className="brand-sub mt-2">PALESTINE · ESPORTS GEAR</div>
              </div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl grad-frame flex items-center justify-center flex-shrink-0">
                <Zap className="w-8 h-8 sm:w-9 sm:h-9 text-[#00a3ff] drop-shadow-[0_0_14px_#00a3ff]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.2rem] font-light text-white leading-[1.4] font-['Cairo']">
              <span className="block font-black text-white">
                خياركم الأفضل في فلسطين
              </span>
              <span className="block text-2xl sm:text-4xl lg:text-[2.5rem] text-gray-200 mt-2 font-light">
                للعتاد الاحترافي.. <span className="glow-cyan font-bold">ارفع مستوى لعبك!</span>
              </span>
            </h1>

            {/* شارة صاحب المتجر والأزرار */}
            <div className="flex flex-wrap items-center justify-end gap-3.5 pt-1">
              <div dir="ltr" className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#020a17] via-[#091b3a] to-[#020a17] border border-[#00a3ff]/60 shadow-[0_0_25px_rgba(0,163,255,0.25)]">
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
                className="btn-neon text-sm sm:text-base px-6 py-2.5 flex items-center gap-2 cursor-pointer group"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{cfg.ctaLabel || "تسوق الآن"}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>

            {/* الشريط المتحرك — مجموعتان متطابقتان فقط (لا 6 تكرارات) لضمان لفّة مثالية بدون اختفاء */}
            <div className="w-full pt-4 pb-2">
              <div
                ref={tickerOuterRef}
                className="w-full overflow-hidden relative [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
              >
                {/* شريط واحد مستمر — نفس مجموعة الكروت مكررة 8 مرات، ومتحرّك
                    مباشرة بالـJS (transform محسوب فريم-فريم)، فلا داعي لأي
                    @keyframes ولا نسب مئوية قد تختل حسب عرض المحتوى */}
                <div
                  ref={tickerTrackRef}
                  className="flex items-center gap-4"
                  style={{ willChange: "transform" }}
                >
                  {Array.from({ length: TICKER_REPEAT }).flatMap((_, g) =>
                    stats.map((s, i) => renderStatCard(s, `t-${g}-${i}`))
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* --- القسم الأيسر: المربع المميز --- */}
          <div className="lg:col-span-6 space-y-4">
            {cfg.enabled && cfg.videoUrls && cfg.videoUrls.length > 0 ? (
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] rounded-3xl blur-xl opacity-50 group-hover:opacity-90 transition duration-1000 animate-cyber-glow" />

                <div className="relative p-[3px] rounded-3xl bg-gradient-to-b from-[#00e5ff] via-[#00a3ff]/70 to-[#0a1630] shadow-[0_25px_60px_-15px_rgba(0,163,255,0.45)]">
                  <div className="relative rounded-[22px] bg-[#040814] overflow-hidden border border-[#00a3ff]/40">

                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent z-30" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.06] to-transparent z-20" />

                    <div className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.7)] scale-105"
                              : "bg-[#09152a] border-[#00a3ff]/40 text-[#00e5ff] hover:border-[#00e5ff]"
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <Disc className="w-4 h-4 animate-spin text-black" />
                              <Volume2 className="w-4 h-4 text-black animate-pulse" />
                            </>
                          ) : (
                            <>
                              <Music className="w-4 h-4 text-[#00e5ff]" />
                              <VolumeX className="w-4 h-4 text-[#00e5ff]" />
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[9px] font-tech tracking-widest text-[#3a5a8a] uppercase select-none">
                          NITRO · GAMES
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tech font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30">
                          <Radio className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" /> {cfg.badgeText}
                        </span>
                      </div>
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
                            setShowcaseVideoIndex((i) => (i + 1) % cfg.videoUrls!.length)
                          }
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />

                        <span className="absolute inset-0 pointer-events-none rounded-xl bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />
                        <span className="absolute inset-0 ring-1 ring-inset ring-[#00a3ff]/40 rounded-xl pointer-events-none shadow-[inset_0_0_30px_rgba(0,163,255,0.3)]" />
                        <span className="absolute inset-[6px] ring-1 ring-inset ring-white/[0.06] rounded-lg pointer-events-none" />

                        <span className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-[#00e5ff]/80 rounded-tr-md pointer-events-none" />
                        <span className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-[#00a3ff]/80 rounded-bl-md pointer-events-none" />

                        {cfg.videoUrls.length > 1 && (
                          <span className="absolute top-3 left-3 z-10 text-[10px] font-tech bg-black/80 text-[#00e5ff] px-2.5 py-1 rounded-md border border-[#00e5ff]/40 backdrop-blur-md">
                            {(showcaseVideoIndex % cfg.videoUrls.length) + 1} / {cfg.videoUrls.length}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="relative z-20 px-5 py-3.5 border-t border-[#142342] bg-[#060c1d]/90 backdrop-blur-md flex items-center justify-between gap-3">
                      <span className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#00e5ff]/70 to-transparent" />
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

                {siteAudioUrl && <audio ref={audioRef} src={siteAudioUrl} loop />}
              </div>
            ) : cfg.enabled && active ? (
              <div
                className="relative group"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              >
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] rounded-3xl blur-xl opacity-50 group-hover:opacity-90 transition duration-1000 animate-cyber-glow" />

                <div className="relative p-[3px] rounded-3xl bg-gradient-to-b from-[#00e5ff] via-[#00a3ff]/70 to-[#101c38] shadow-[0_25px_60px_-15px_rgba(0,163,255,0.45)]">
                  <div className="relative rounded-[22px] bg-[#040814] overflow-hidden border border-[#00a3ff]/40">

                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent z-30" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/[0.06] to-transparent z-20" />

                    <div className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.7)] scale-105"
                              : "bg-[#09152a] border-[#00a3ff]/40 text-[#00e5ff] hover:border-[#00e5ff]"
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <Disc className="w-4 h-4 animate-spin text-black" />
                              <Volume2 className="w-4 h-4 text-black animate-pulse" />
                            </>
                          ) : (
                            <>
                              <Music className="w-4 h-4 text-[#00e5ff]" />
                              <VolumeX className="w-4 h-4 text-[#00e5ff]" />
                            </>
                          )}
                        </button>
                      ) : <div />}

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tech font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30">
                          <Flame className="w-3.5 h-3.5 text-[#00e5ff] fill-[#00a3ff]/40 animate-pulse" /> {cfg.badgeText}
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

                      <span className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#00e5ff] rounded-tr-lg pointer-events-none" />
                      <span className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#00a3ff] rounded-bl-lg pointer-events-none" />

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
                    </div>

                    <div className="relative z-20 px-5 py-3.5 border-t border-[#142342] bg-[#060c1d]/90 backdrop-blur-md flex items-center justify-between gap-3">
                      <span className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#00e5ff]/70 to-transparent" />
                      <div className="min-w-0 text-right">
                        <div className="text-[10px] font-tech text-[#00a3ff] uppercase tracking-wider">{active.brand}</div>
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
