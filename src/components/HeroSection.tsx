"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, ShoppingBag, Radio, Music, Play, Pause, Flame } from "lucide-react";
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
    <section className="w-full max-w-md mx-auto px-4 py-2" dir="rtl">
      {/* الكرت الخارجي بإطار Cyber-Tech تجويفي وتأثير نيون فريد */}
      <div className="relative rounded-3xl p-4 bg-[#070e1c] border border-[#00e5ff]/40 shadow-[0_0_25px_rgba(0,163,255,0.2)] overflow-hidden">
        
        {/* أركان نيون ديكورية (Cyber Corners) */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00e5ff] rounded-tr-2xl pointer-events-none shadow-[0_0_10px_#00e5ff]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00e5ff] rounded-bl-2xl pointer-events-none shadow-[0_0_10px_#00e5ff]" />

        {/* خط نيون مضيء علوي وسفلي خفيف */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#00a3ff] to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between">
          
          {/* 1. الشريط العلوي: شارة LIVE SHOWCASE وأزرار التحكم */}
          <div className="flex items-center justify-between mb-3">
            
            {/* شارة LIVE SHOWCASE */}
            <div className="flex items-center gap-2 bg-[#09172e] border border-[#00e5ff]/50 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.25)]">
              <Radio className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-[#00e5ff] font-mono">
                LIVE SHOWCASE
              </span>
            </div>

            {/* الأزرار العلوية */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-[#0d2142] hover:bg-[#00a3ff]/20 border border-[#00a3ff]/40 text-[#00e5ff] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,163,255,0.3)] active:scale-95"
                type="button"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-[#00e5ff]" />
                )}
              </button>
              <button 
                className="p-2 bg-[#0d2142] hover:bg-[#00a3ff]/20 border border-[#00a3ff]/40 text-[#00e5ff] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,163,255,0.3)]"
                type="button"
              >
                <Music className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

          </div>

          {/* 2. حاوية الفيديو / التشغيل */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#16294a] bg-[#030914] flex items-center justify-center group">
            
            {/* خلفية نقطية تكنولوجية */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(rgba(0, 229, 255, 0.4) 1px, transparent 1px)`,
                backgroundSize: `14px 14px`
              }}
            />

            {/* شارة الترقيم */}
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-[#070e1c]/80 backdrop-blur-md border border-[#00e5ff]/30 text-[#00e5ff] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
              <Flame className="w-3 h-3 text-[#ff8800]" />
              <span>4 / 3</span>
            </div>

            {/* زر التشغيل الإحترافي المتوهج */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)] hover:scale-110 transition-transform active:scale-95"
              type="button"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black fill-black" />
              ) : (
                <Play className="w-5 h-5 text-black fill-black mr-0.5" />
              )}
            </button>

            {/* إضاءة خلف الزر */}
            <div className="absolute w-28 h-28 bg-[#00a3ff]/20 rounded-full blur-2xl pointer-events-none" />

          </div>

          {/* 3. الشريط السفلي */}
          <div className="flex items-center justify-between mt-3">
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
              <span className="text-xs font-black text-white tracking-wide">
                عتاد البطولات • جاهز للشحن
              </span>
            </div>

            <button 
              onClick={() => onCategorySelect && onCategorySelect('all')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#00a3ff] to-[#0066ff] hover:from-[#00e5ff] hover:to-[#00a3ff] text-white text-[11px] font-extrabold px-3.5 py-2 rounded-xl shadow-[0_0_12px_rgba(0,163,255,0.4)] transition-all active:scale-95"
              type="button"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>تسوق الآن</span>
            </button>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
