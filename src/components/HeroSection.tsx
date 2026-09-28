'use client';

import React from 'react';
import { ShoppingBag, ArrowLeft, Crown, Zap, Sparkles } from 'lucide-react';

// تعريف الـ Props لتوافق TypeScript مع page.tsx
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
  return (
    <section className="relative w-full min-h-screen bg-[#080d14] text-white flex flex-col items-center pt-6 pb-12 px-4 overflow-hidden font-sans dir-rtl">
      {/* خلفية الشبكة الجيمينج - Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#00d2ff 1px, transparent 1px), linear-gradient(90deg, #00d2ff 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* التوهج الأزرق الخلفي */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. البادج العلوي الصغير */}
      <div className="relative z-10 flex items-center justify-between gap-3 bg-[#0d1622]/90 border border-cyan-500/30 rounded-full py-1.5 px-3 max-w-sm w-full mb-8 shadow-[0_0_15px_rgba(0,210,255,0.1)]">
        <span className="text-[11px] text-gray-300 font-medium">
          المتجر الأول لطرفيات الجيمينج الاحترافية في فلسطين
        </span>
        <span className="flex items-center gap-1 bg-cyan-400 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full tracking-wider">
          CYBER ESPORTS
        </span>
      </div>

      {/* 2. اللوجو والرمز المحيط به */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-[#0b131e] border border-cyan-400/40 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,210,255,0.15)]">
          <Zap className="w-8 h-8 text-cyan-400 fill-cyan-400/20" />
        </div>
        
        <h2 className="text-2xl font-black tracking-widest text-white uppercase">
          NITRO GAMES
        </h2>
        <p className="text-[10px] tracking-[0.25em] text-cyan-400/80 uppercase font-semibold mt-1">
          PALESTINE · ESPORTS GEAR
        </p>
      </div>

      {/* 3. العناوين الرئيسية */}
      <div className="relative z-10 text-center max-w-md my-4 space-y-2">
        <span className="text-xs font-bold tracking-widest text-cyan-400/90 uppercase block">
          NITRO GAMES
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white">
          خياركم الأفضل في فلسطين
        </h1>
        <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 shadow-cyan-500/50 drop-shadow-[0_0_12px_rgba(0,212,255,0.6)]">
          للعتاد الاحترافي.. ارفع مستوى لعبك!
        </p>
      </div>

      {/* 4. معلومات مالك المتجر (Store Owner) */}
      <div className="relative z-10 mt-6 mb-4 flex items-center gap-2 bg-[#0a121c] border border-cyan-500/30 rounded-2xl px-4 py-2 text-xs shadow-inner">
        <Crown className="w-4 h-4 text-amber-400" />
        <span className="text-gray-400 font-semibold uppercase text-[11px]">STORE OWNER:</span>
        <span className="text-cyan-400 font-bold text-sm">YaMEn</span>
        <Sparkles className="w-3.5 h-3.5 text-cyan-400 mr-1" />
      </div>

      {/* 5. زر التسوق */}
      <button 
        onClick={() => onCategorySelect && onCategorySelect('all')}
        className="relative z-10 mt-2 w-full max-w-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,210,255,0.4)] transition-all active:scale-95"
      >
        <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
        <span className="text-base">تسوق الآن</span>
        <ArrowLeft className="w-5 h-5 stroke-[2.5] mr-auto" />
      </button>

      {/* 6. شريط المميزات السفلي (Bottom Bar) */}
      <div className="relative z-10 mt-12 w-full max-w-md bg-[#0a121d]/90 border border-cyan-500/20 rounded-2xl p-2.5 flex items-center justify-between shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00d2ff]" />
          <span className="text-xs font-bold text-gray-200">مزايا المتجر</span>
          <span className="bg-cyan-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
            NITRO GAMES
          </span>
        </div>
        <button className="p-1.5 rounded-lg bg-[#0f1b2b] border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
