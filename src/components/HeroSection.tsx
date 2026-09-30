"use client";

import React from "react";
import { Search, ShoppingBag, Heart, Menu, Zap, ShieldCheck } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#020914] border-b border-[#00A8FF]/20 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      {/* Top Banner / Ticker */}
      <div className="bg-[#041226] border-b border-[#00A8FF]/10 py-1.5 px-4 text-xs text-gray-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00D9FF]">
            <Zap className="w-3.5 h-3.5" />
            <span className="font-bold">ارفع مستوى لعبك!</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>خدمة توصيل سريعة وبضائع أصلية 100%</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-[#081a30] border border-[#00A8FF]/20 text-gray-300 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl bg-[#081a30] border border-[#00A8FF]/20 text-gray-300 hover:text-white relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-[#00D9FF] text-[#020914] text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </button>
          <button className="p-2 rounded-xl bg-[#081a30] border border-[#00A8FF]/20 text-gray-300 hover:text-white">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl bg-[#081a30] border border-[#00A8FF]/20 text-gray-300 hover:text-white">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Logo Center */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-white font-black text-lg tracking-wider">
              NITRO <span className="text-[#00D9FF]">GAMES</span>
            </div>
            <div className="text-[9px] text-gray-400 uppercase tracking-widest -mt-1 font-tech">
              PALESTINE
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-[#00A8FF]/10 border border-[#00A8FF]/30">
            <Zap className="w-4 h-4 text-[#00D9FF]" />
          </div>
        </div>
      </div>
    </header>
  );
};
