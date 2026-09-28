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
    { icon: <span className="text-[#00a3ff]">⭐</span>, big: "+5,400", small: "لاعب يثق بنا" },
    { icon: <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />, big: "1 سنة", small: "ضمان حقيقي" },
    { icon: <CheckCircle2 className="w-4 h-4 text-[#00a3ff]" />, big: "100%", small: "أصلي معتمد" },
    { icon: <Truck className="w-4 h-4 text-[#00e5ff]" />, bg: "24-48h", small: "شحن سريع" },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-24 bg-[#03060f] border-b border-[#16223a]">
      <style>{`
        @keyframes marqueeLoop {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marqueeLoop 10s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
        @keyframes cyberGlow {
          0%, 100% { opacity: 0.6; filter: drop-shadow(0 0 15px rgba(0, 163, 255, 0.4)); }
          50% { opacity: 1; filter: drop-shadow(0 0 25px rgba(0, 229, 255, 0.8)); }
        }
        .animate-cyber-glow {
          animation: cyberGlow 3s infinite ease-in-out;
        }
      `}</style>

      <div className="absolute inset-0 tech-grid opacity-80 pointer-events-none" />
      <div className="absolute -top-24 right-1/4 w-[520px] h-[380px] bg-[#00a3ff]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -left-24 w-[520px] h-[380px] bg-[#00e5ff]/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Top badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full panel border-[#00a3ff]/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a3ff] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00a3ff]" />
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-gray-200">
              المتجر الأول لطرفيات الجيمينج الاحترافية في فلسطين
            </span>
            <span className="text-[10px] font-black bg-[#00e5ff] text-[#02121f] px-2 py-0.5 rounded-full font-tech">
              CYBER ESPORTS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* --- RIGHT: Copy & Store Owner Banner --- */}
          <div className="lg:col-span-6 space-y-6 text-right">
            <div className="flex items-center gap-4 justify-end">
              <div className="text-right">
                <div className="brand-mark brand-mark-lg text-white">
                  NITRO <span className="brand-mark-games">GAMES</span>
                </div>
                <div className="brand-sub mt-2">PALESTINE · ESPORTS GEAR</div>
              </div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl grad-frame flex items-center justify-center flex-shrink-0">
                <Zap className="w-8 h-8 sm:w-9 sm:h-9 text-[#00a3ff] drop-shadow-[0_0_14px_#00a3ff]" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.2rem] font-black text-white leading-[1.25] font-['Cairo']">
              <span className="brand-mark brand-mark-md text-white">NITRO GAMES</span>
              <span className="block mt-2">
                <span className="sr-only">نيترو قيمز — </span>خياركم الأفضل في فلسطين
              </span>
              <span className="block text-2xl sm:text-4xl lg:text-[2.5rem] text-gray-100 mt-1.5">
                للعتاد الاحترافي.. <span className="glow-cyan">ارفع مستوى لعبك!</span>
              </span>
            </h1>

            {/* الأزرار + شارة صاحب المتجر */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              {/* شارة صاحب المتجر */}
              <div dir="ltr" className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#020a17] via-[#091b3a] to-[#020a17] border border-[#00a3ff]/70 shadow-[0_0_25px_rgba(0,163,255,0.3)]">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400/30 animate-bounce" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">
                  STORE OWNER:
                </span>
                <span className="text-sm font-black text-[#00e5ff] tracking-widest drop-shadow-[0_0_12px_rgba(0,229,255,0.9)] font-mono">
                  YamEn
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#00a3ff]" />
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

            {/* الشريط المتحرك المتصل بدون انقطاع */}
            <div className="w-full overflow-hidden pt-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="animate-marquee-infinite gap-3.5">
                {[...stats, ...stats, ...stats, ...stats].map((s, i) => (
                  <div
                    key={i}
                    className="relative group overflow-hidden bg-[#0a101d]/90 backdrop-blur-md border border-[#1a2c4e] hover:border-[#00e5ff]/60 rounded-xl px-4 py-2.5 text-right flex items-center gap-3 shrink-0 ml-3 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                  >
                    <div className="text-base font-black text-white font-tech flex items-center gap-2 relative z-10">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a3ff]" />
                      </span>
                      {s.big} {s.icon}
                    </div>
                    <div className="text-[11px] text-gray-300 font-bold font-['Cairo'] relative z-10 border-r border-[#1e345b] pr-3">
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
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00a3ff] via-[#00e5ff] to-[#7000ff] rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-1000 group-hover:duration-200 animate-cyber-glow" />

                <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-[#00e5ff]/60 via-[#00a3ff]/30 to-[#101c38]/80 shadow-[0_0_40px_rgba(0,163,255,0.25)]">
                  <div className="rounded-[22px] bg-[#040814] overflow-hidden">
                    
                    {/* Header المحدث: تم عكس الأماكن وتحديث زر الموسيقى بدون كلمة AUDIO */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      
                      {/* جهة اليمين: زر التحكم بالموسيقى والصوت بأسلوب نيون فاخر */}
                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.8)] scale-105"
                              : "bg-[#09152a] border-[#00a3ff]/40 text-[#00e5ff] hover:border-[#00e5ff]"
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
                              <Music className="w-4 h-4 text-[#00e5ff]" />
                              <VolumeX className="w-4 h-4 text-[#00e5ff]" />
                            </>
                          )}
                        </button>
                      ) : <div />}

                      {/* جهة اليسار: شارة العرض LIVE SHOWCASE */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tech font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]">
                          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" /> {cfg.badgeText}
                        </span>
                      </div>
                    </div>

                    {/* منطقة عرض الفيديو */}
                    <div className="relative h-60 sm:h-72 w-full bg-[#000000] p-2">
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
                        {cfg.videoUrls.length > 1 && (
                          <span className="absolute top-3 left-3 z-10 text-[10px] font-tech bg-black/80 text-[#00e5ff] px-2.5 py-1 rounded-md border border-[#00e5ff]/40 backdrop-blur-md">
                            {(showcaseVideoIndex % cfg.videoUrls.length) + 1} / {cfg.videoUrls.length}
                          </span>
                        )}
                        <span className="absolute inset-0 ring-1 ring-inset ring-[#00a3ff]/40 rounded-xl pointer-events-none shadow-[inset_0_0_30px_rgba(0,163,255,0.3)]" />
                      </div>
                    </div>

                    {/* Footer الأسفل */}
                    <div className="px-5 py-3.5 border-t border-[#142342] bg-[#060c1d] flex items-center justify-between gap-3">
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo'] tracking-wide">
                        {cfg.headline}
                      </h3>
                      <a
                        href="#products"
                        className="btn-pink text-[11px] px-4 py-2 flex items-center gap-2 cursor-pointer whitespace-nowrap rounded-xl shadow-[0_0_15px_rgba(255,0,128,0.4)]"
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
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00a3ff] via-[#00e5ff] to-[#7000ff] rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-1000 group-hover:duration-200 animate-cyber-glow" />

                <div className="relative p-[2px] rounded-3xl bg-gradient-to-b from-[#00e5ff]/60 via-[#00a3ff]/30 to-[#101c38]/80 shadow-[0_0_40px_rgba(0,163,255,0.25)]">
                  <div className="rounded-[22px] bg-[#040814] overflow-hidden">
                    
                    {/* Header المحدث لصور المنتجات */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#142342] bg-gradient-to-r from-[#070e20] via-[#0b1733] to-[#070e20]">
                      
                      {/* جهة اليمين: زر التحكم بالموسيقى والصوت */}
                      {siteAudioUrl ? (
                        <button
                          onClick={toggleAudio}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer border ${
                            isPlaying
                              ? "bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.8)] scale-105"
                              : "bg-[#09152a] border-[#00a3ff]/40 text-[#00e5ff] hover:border-[#00e5ff]"
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
                              <Music className="w-4 h-4 text-[#00e5ff]" />
                              <VolumeX className="w-4 h-4 text-[#00e5ff]" />
                            </>
                          )}
                        </button>
                      ) : <div />}

                      {/* جهة اليسار: شارة المعرض + أزرار التنقل */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-tech font-black text-[#00e5ff] flex items-center gap-1.5 bg-[#091830] px-3 py-1 rounded-lg border border-[#00e5ff]/30 shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]">
                          <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> {cfg.badgeText}
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

                    {/* منطقة معرض الصور */}
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

                      <span className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#00e5ff] rounded-tr-lg" />
                      <span className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#00a3ff] rounded-bl-lg" />

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
                        {CATEGORIES_META.find((c) => c.id === active.category)?.name ?? active.category}
                      </span>
                    </div>

                    {/* Footer الأسفل */}
                    <div className="px-5 py-3.5 border-t border-[#142342] bg-[#060c1d] flex items-center justify-between gap-3">
                      <div className="min-w-0 text-right">
                        <div className="text-[10px] font-tech text-[#00a3ff] uppercase tracking-wider">{active.brand}</div>
                        <h3 className="text-xs sm:text-sm font-bold text-white truncate font-['Cairo']">
                          {active.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => addToCart(active, 1)}
                        className="btn-pink text-[11px] px-4 py-2 flex items-center gap-2 cursor-pointer whitespace-nowrap rounded-xl shadow-[0_0_15px_rgba(255,0,128,0.4)]"
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
