'use client';

import React from 'react';
import { ShoppingBag, ArrowLeft, Crown, Zap, Sparkles, Star, ShieldCheck, Truck, Headphones } from 'lucide-react';

interface ShowcaseConfig {
  type?: 'video' | 'slider';
  videos?: string[];
  images?: string[];
  [key: string]: any;
}

interface HeroSectionProps {
  products?: any[];
  showcase?: ShowcaseConfig;
  onCategorySelect?: (cat: any) => void;
}

export function HeroSection({ products = [], showcase, onCategorySelect }: HeroSectionProps) {
  const tickerItems = [
    { icon: <Star className="w-4 h-4 text-amber-400 fill-amber-400" />, title: "+11,400", sub: "عميل يثق بنا" },
    { icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />, title: "ضمان 1 سنة", sub: "شامل وصريح" },
    { icon: <Truck className="w-4 h-4 text-cyan-400" />, title: "100%", sub: "توصيل آمن" },
    { icon: <Headphones className="w-4 h-4 text-cyan-400" />, title: "دعم متخصص", sub: "على مدار الساعة" },
  ];

  return (
    <section className="relative w-full min-h-screen bg-[#080d14] text-white flex flex-col items-center pt-6 pb-12 px-4 overflow-hidden font-sans dir-rtl">
      {/* خلفية الشبكة الجيمينج */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#00d2ff 1px, transparent 1px), linear-gradient(90deg, #00d2ff 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* التوهج الخلفي */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. البادج العلوي */}
      <div className="relative z-10 flex items-center justify-between gap-3 bg-[#0d1622]/90 border border-cyan-500/30 rounded-full py-1.5 px-3 max-w-sm w-full mb-6 shadow-[0_0_15px_rgba(0,210,255,0.1)]">
        <span className="text-[11px] text-gray-300 font-medium">
          المتجر الأول لطرفيات الجيمينج الاحترافية في فلسطين
        </span>
        <span className="flex items-center gap-1 bg-cyan-400 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full tracking-wider">
          CYBER ESPORTS
        </span>
      </div>

      {/* 2. اللوجو */}
      <div className="relative z-10 flex flex-col items-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-[#0b131e] border border-cyan-400/40 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,210,255,0.15)]">
          <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400/20" />
        </div>
        
        <h2 className="text-2xl font-black tracking-widest text-white uppercase">
          NITRO GAMES
        </h2>
        <p className="text-[10px] tracking-[0.25em] text-cyan-400/80 uppercase font-semibold mt-1">
          PALESTINE · ESPORTS GEAR
        </p>
      </div>

      {/* 3. العناوين */}
      <div className="relative z-10 text-center max-w-md my-2 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
          خياركم الأفضل في فلسطين
        </h1>
        <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 shadow-cyan-500/50 drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]">
          للعتاد الاحترافي.. ارفع مستوى لعبك!
        </p>
      </div>

      {/* 4. Owner & Button */}
      <div className="relative z-10 my-4 flex flex-col items-center gap-3 w-full max-w-xs">
        <div className="flex items-center gap-2 bg-[#0a121c] border border-cyan-500/30 rounded-2xl px-4 py-2 text-xs shadow-inner">
          <Crown className="w-4 h-4 text-amber-400" />
          <span className="text-gray-400 font-semibold uppercase text-[11px]">STORE OWNER:</span>
          <span className="text-cyan-400 font-bold text-sm">YaMEn</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 mr-1" />
        </div>

        <button 
          onClick={() => onCategorySelect && onCategorySelect('all')}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all active:scale-95"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
          <span className="text-base">تسوق الآن</span>
          <ArrowLeft className="w-5 h-5 stroke-[2.5] mr-auto" />
        </button>
      </div>

      {/* 5. الشريط المتحرك الجديد (سريع ومضبوط للموبايل) */}
      <div className="relative z-10 w-full max-w-lg my-5 overflow-hidden bg-[#0c1624]/90 border border-cyan-500/30 rounded-2xl py-2.5 shadow-[0_0_20px_rgba(0,210,255,0.08)] backdrop-blur-md dir-ltr">
        {/* التلاشي عند الأطراف */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-[#080d14] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-[#080d14] to-transparent z-20 pointer-events-none" />

        <div className="flex w-max animate-infinite-scroll space-x-4">
          {/* مضاعفة العناصر لضمان استمرار الدوران بشكل غير منقطع */}
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 bg-[#08101a] border border-cyan-500/20 rounded-xl px-3.5 py-1.5 shrink-0 shadow-sm dir-rtl"
            >
              <div className="p-1 rounded-lg bg-cyan-950/50 border border-cyan-500/30">
                {item.icon}
              </div>
              <div className="flex flex-col text-right">
                <span className="text-xs font-black text-white whitespace-nowrap">{item.title}</span>
                <span className="text-[9px] text-gray-400 whitespace-nowrap">{item.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. استعراض الكيبورد (الميديا) */}
      <div className="relative z-10 w-full max-w-2xl bg-[#0a131f] border border-cyan-500/40 rounded-3xl p-2.5 shadow-[0_0_30px_rgba(0,210,255,0.15)] overflow-hidden">
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-cyan-500/20 bg-black">
          {showcase?.videos && showcase.videos.length > 0 ? (
            <video 
              src={showcase.videos[0]} 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={showcase?.images?.[0] || "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1000&auto=format&fit=crop"} 
              alt="Live Showcase" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-cyan-500/40 text-cyan-400 font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            LIVE SHOWCASE
          </div>
        </div>
      </div>

      {/* كود الحركة الأنيميشن المباشر */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 15s linear infinite;
        }
      `}</style>
    </section>
  );
}
