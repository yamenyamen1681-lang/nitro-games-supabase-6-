"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, ShoppingBag, Radio, Music, Play, Pause, Flame } from "lucide-react";
import { Product } from "@/lib/data";

// 1. تعريف واجهة الـ Props لتعالج خطأ TypeScript
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
      {/* الكرت الخارجي مع إطار نيون متوهج وتدرج خلفي مائل */}
      <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-[#00e5ff] via-[#0051ff]/30 to-[#9d00ff] shadow-[0_0_30px_rgba(0,229,255,0.2)]">
        
        {/* خلفية توهج داخلية خفيفة */}
        <div className="absolute inset-0 bg-[#040a17]/90 rounded-3xl backdrop-blur-2xl" />

        <div className="relative z-10 p-3.5 flex flex-col justify-between">
          
          {/* 1. الشريط العلوي: شارة البث والأزرار */}
          <div className="flex items-center justify-between mb-3">
            
            {/* شارة LIVE SHOWCASE بتصميم المستقبل */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-[#00e5ff]/15 to-[#0066ff]/15 border border-[#00e5ff]/50 px-3 py-1 rounded-xl shadow-[inset_0_0_10px_rgba(0,229,255,0.2)]">
              <Radio className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-[#00e5ff] font-mono">
                LIVE SHOWCASE
              </span>
            </div>

            {/* أزرار الصوت والموسيقى التفاعلية */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 bg-[#0a1833] hover:bg-[#00e5ff]/20 border border-[#183661] text-[#00e5ff] rounded-lg transition-all active:scale-95"
                type="button"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-gray-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#00e5ff]" />}
              </button>
              <button 
                className="p-1.5 bg-[#0a1833] hover:bg-[#00e5ff]/20 border border-[#183661] text-[#00e5ff] rounded-lg transition-all"
                type="button"
              >
                <Music className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>

          </div>

          {/* 2. حاوية المشغل (فيديو / صورة) */}
          <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#162e54] bg-[#020612] flex items-center justify-center group">
            
            {/* شبكة خلفية سايبر */}
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(#00e5ff 1px, transparent 1px)`,
                backgroundSize: `12px 12px`
              }}
            />

            {/* شارة الترقيم */}
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-[#040a17]/80 backdrop-blur-md border border-[#00e5ff]/30 text-[#00e5ff] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
              <Flame className="w-3 h-3 text-[#ff8800]" />
              <span>4 / 3</span>
            </div>

            {/* زر التشغيل/الإيقاف المخصص */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative z-20 w-12 h-12 bg-gradient-to-tr from-[#0051ff] to-[#00e5ff] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.6)] hover:scale-110 transition-transform active:scale-95"
              type="button"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black fill-black" />
              ) : (
                <Play className="w-5 h-5 text-black fill-black mr-0.5" />
              )}
            </button>

            {/* إضاءة دائرية خلف الزر */}
            <div className="absolute w-24 h-24 bg-[#00e5ff]/20 rounded-full blur-xl pointer-events-none" />

          </div>

          {/* 3. الشريط السفلي: النص وزر التسوق */}
          <div className="flex items-center justify-between mt-3">
            
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
              <span className="text-xs font-black text-white tracking-wide">
                عتاد البطولات • جاهز للشحن
              </span>
            </div>

            <button 
              onClick={() => onCategorySelect && onCategorySelect('all')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#00a3ff] to-[#0051ff] hover:from-[#00e5ff] hover:to-[#00a3ff] text-white text-[11px] font-extrabold px-3.5 py-2 rounded-xl shadow-[0_0_12px_rgba(0,163,255,0.4)] transition-all active:scale-95"
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
