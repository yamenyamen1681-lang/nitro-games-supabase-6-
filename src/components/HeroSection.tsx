"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, ShoppingBag, Sparkles } from "lucide-react";

export const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="w-full max-w-md mx-auto px-4 py-3" dir="rtl">
      {/* الإطار الخارجي المتوهج بأنيميشن الليزر المتحرك */}
      <div className="relative group p-[2px] rounded-3xl overflow-hidden shadow-[0_0_25px_rgba(0,229,255,0.25)]">
        
        {/* خط الليزر المتحرك حول الإطار */}
        <div className="absolute -inset-[200%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_300deg,#00e5ff_340deg,#00a3ff_360deg)] opacity-100" />

        {/* الكرت الداخلي */}
        <div className="relative bg-[#040914] rounded-[22px] p-3 border border-[#102342] backdrop-blur-xl z-10">
          
          {/* الشريط العلوي: LIVE SHOWCASE على اليمين وزر الصوت على اليسار */}
          <div className="flex items-center justify-between mb-3 px-1">
            
            {/* جهة اليمين: LIVE SHOWCASE */}
            <div className="flex items-center gap-2 bg-[#09172e]/90 border border-[#00e5ff]/40 px-3 py-1.5 rounded-full shadow-[0_0_12px_rgba(0,229,255,0.25)]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5ff]"></span>
              </span>
              <span className="text-[11px] font-black tracking-widest text-[#00e5ff] font-mono uppercase">
                LIVE SHOWCASE
              </span>
            </div>

            {/* جهة اليسار: زر الصوت والموسيقى */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 bg-[#0d2142] hover:bg-[#00a3ff]/20 border border-[#00a3ff]/40 text-[#00e5ff] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(0,163,255,0.3)] active:scale-95"
              aria-label="Toggle Audio"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-gray-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#00e5ff] animate-pulse" />
              )}
            </button>

          </div>

          {/* حاوية الصورة/الفيديو الشاشية */}
          <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-[#162d54] bg-[#020611] group">
            
            {/* خلفية النقاط */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(rgba(0, 229, 255, 0.4) 1px, transparent 1px)`,
                backgroundSize: `14px 14px`
              }}
            />

            {/* شارة عدد الصور */}
            <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg font-mono">
              3 / 4
            </div>

            {/* الصورة */}
            <img
              src="/keyboard.png" 
              alt="Live Showcase"
              className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#040914] via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>

          {/* الشريط السفلي */}
          <div className="flex items-center justify-between mt-3.5 px-1">
            
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#00e5ff]" />
              <span className="text-sm font-extrabold text-white tracking-wide">
                عتاد البطولات • جاهز للشحن
              </span>
            </div>

            <button className="flex items-center gap-2 bg-gradient-to-r from-[#00a3ff] via-[#0066ff] to-[#00e5ff] text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(0,163,255,0.4)] hover:shadow-[0_0_22px_rgba(0,229,255,0.8)] transition-all duration-300 active:scale-95">
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
