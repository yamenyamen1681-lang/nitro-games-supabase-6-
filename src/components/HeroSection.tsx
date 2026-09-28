"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Music, Play, Pause, ShoppingBag } from "lucide-react";
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
      {/* الكرت الخارجي المطابق للصورة */}
      <div className="relative rounded-3xl p-4 bg-[#070e1c] border border-[#00a3ff]/40 shadow-[0_0_20px_rgba(0,163,255,0.2)]">
        
        {/* 1. الشريط العلوي: أزرار الموسيقى والصوت على اليمين، وشارة LIVE SHOWCASE على اليسار */}
        <div className="flex items-center justify-between mb-3">
          
          {/* الأزرار العلوية (جهة اليمين) */}
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

          {/* شارة LIVE SHOWCASE (جهة اليسار) */}
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

        {/* 2. حاوية المشغل الرئيسي */}
        <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#162a4a] bg-[#040a17] flex items-center justify-center">
          
          {/* شارة الترقيم 3/4 (جهة اليمين علوي) */}
          <div className="absolute top-2.5 right-2.5 z-20 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md font-mono">
            3 / 4
          </div>

          {/* زر التشغيل والإيقاف الدائري الأبيض في المنتصف */}
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

        {/* 3. الشريط السفلي: النص على اليمين وزر التسوق على اليسار */}
        <div className="flex items-center justify-between mt-3">
          
          {/* النص على اليمين */}
          <span className="text-xs font-bold text-white tracking-wide">
            عتاد البطولات • جاهز للشحن
          </span>

          {/* زر تسوق الآن على اليسار مع الأيقونة */}
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
