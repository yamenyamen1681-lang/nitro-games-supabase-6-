"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Music, Play, Pause, ShoppingBag, Zap, Crown, Sparkles, Star, ArrowLeft } from "lucide-react";
import { Product } from "@/lib/data";

interface HeroSectionProps {
  products?: Product[] | any[];
  showcase?: any;
  onCategorySelect?: (cat: any) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  products = [],
  showcase,
  onCategorySelect,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full max-w-md mx-auto px-4 py-4 space-y-6" dir="rtl">
      
      {/* 1. قسم العنونة والترحيب الرئيسي (كما في الصورة الجديدة) */}
      <div className="flex flex-col items-center text-center space-y-4">
        
        {/* اللوجو العالي مع الأيقونة */}
        <div className="flex items-center gap-3 justify-center">
          <div className="w-12 h-12 rounded-2xl bg-[#091832] border border-[#00a3ff]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,163,255,0.3)]">
            <Zap className="w-6 h-6 text-[#00e5ff] fill-[#00e5ff]/20" />
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-black tracking-wider text-white font-mono leading-none">
              NITRO
            </h1>
            <h1 className="text-xl font-extrabold tracking-widest text-[#00e5ff] font-mono leading-tight">
              GAMES
            </h1>
            <p className="text-[9px] font-bold tracking-widest text-gray-400 font-mono">
              PALESTINE • ESPORTS GEAR
            </p>
          </div>
        </div>

        {/* النصوص الرئيسية */}
        <div className="space-y-1">
          <h2 className="text-xs font-black tracking-widest text-gray-300 font-mono">
            NITRO GAMES
          </h2>
          <h3 className="text-2xl font-black text-white leading-snug">
            خياركم الأفضل في <br />
            <span className="text-white">فلسطين</span>
          </h3>
          <p className="text-base font-extrabold text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]">
            للعتاد الاحترافي.. ارفع مستوى لعبك!
          </p>
        </div>

        {/* شارة مالك المتجر STORE OWNER */}
        <div className="inline-flex items-center gap-2 bg-[#09172e] border border-[#00e5ff]/30 px-4 py-1.5 rounded-2xl shadow-[0_0_10px_rgba(0,229,255,0.15)]">
          <Crown className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span className="text-xs font-mono font-bold text-gray-300">
            STORE OWNER: <span className="text-[#00e5ff] font-extrabold">YamEn</span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />
        </div>

        {/* زر التسوق الرئيسي مع سهم */}
        <button
          onClick={() => onCategorySelect && onCategorySelect('all')}
          className="w-full max-w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#00a3ff] to-[#0051ff] text-white text-sm font-black py-2.5 rounded-2xl shadow-[0_0_20px_rgba(0,163,255,0.5)] transition active:scale-95"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>تسوق الآن</span>
          <ShoppingBag className="w-4 h-4 ml-1" />
        </button>

        {/* شارة عدد اللاعبين (إحصائيات) */}
        <div className="inline-flex items-center gap-2 bg-[#081326] border border-[#162e54] px-4 py-1.5 rounded-xl text-xs font-bold text-gray-300">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
          <span>لاعب يثق بنا</span>
          <span className="text-white font-mono font-black text-sm flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            +5,400
          </span>
        </div>

      </div>

      {/* 2. كرت البث المشغل (Hero Video Showcase) */}
      <div className="relative rounded-3xl p-4 bg-[#070e1c] border border-[#00a3ff]/40 shadow-[0_0_20px_rgba(0,163,255,0.2)]">
        
        {/* الشريط العلوي للكرت */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 bg-[#0c1c38] hover:bg-[#00a3ff]/20 border border-[#17325c] text-[#00e5ff] rounded-xl transition"
              type="button"
            >
              <Music className="w-4 h-4 text-gray-300" />
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-[#0c1c38] hover:bg-[#00a3ff]/20 border border-[#17325c] text-[#00e5ff] rounded-xl transition active:scale-95"
              type="button"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-gray-300" /> : <Volume2 className="w-4 h-4 text-[#00e5ff]" />}
            </button>
          </div>

          <div className="flex items-center gap-2 bg-[#0a1832] border border-[#00e5ff]/40 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[11px] font-black tracking-widest text-[#00e5ff] font-mono uppercase">
              LIVE SHOWCASE
            </span>
          </div>
        </div>

        {/* حاوية المشغل */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#162a4a] bg-[#040a17] flex items-center justify-center">
          <div className="absolute top-2.5 right-2.5 z-20 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md font-mono">
            3 / 4
          </div>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative z-20 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transition transform active:scale-95"
            type="button"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-black fill-black" />
            ) : (
              <Play className="w-6 h-6 text-black fill-black ml-0.5" />
            )}
          </button>
        </div>

        {/* أسفل الكرت */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs font-bold text-white tracking-wide">
            عتاد البطولات • جاهز للشحن
          </span>

          <button 
            onClick={() => onCategorySelect && onCategorySelect('all')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#00a3ff] to-[#0051ff] text-white text-xs font-black px-4 py-2 rounded-xl shadow-[0_0_12px_rgba(0,163,255,0.4)] transition active:scale-95"
            type="button"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>تسوق الآن</span>
          </button>
        </div>

      </div>

    </section>
  );
};

export default HeroSection;
