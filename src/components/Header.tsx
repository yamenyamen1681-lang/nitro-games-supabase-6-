"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { STORE_CONTACT } from "@/lib/data";
import {
  ShoppingBag,
  Heart,
  Search,
  Menu,
  X,
  ShieldCheck,
  Truck,
  PhoneCall,
  Keyboard,
  Mouse,
  Square,
  Mic,
  Headphones,
  Lock,
  Zap,
} from "lucide-react";

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  onCategorySelect?: (cat: string) => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  onCategorySelect,
  onOpenAdmin,
}) => {
  const { totalItemsCount, total, setIsCartOpen, wishlist } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) onSearchChange(searchQuery);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryClick = (catId: string) => {
    if (onCategorySelect) onCategorySelect(catId);
    setMobileMenuOpen(false);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  const categories = [
    { id: "keyboards", label: "كيبورد", icon: Keyboard },
    { id: "mice", label: "ماوس", icon: Mouse },
    { id: "mousepads", label: "ماوس باد", icon: Square },
    { id: "microphones", label: "مايك", icon: Mic },
    { id: "headsets", label: "سماعات", icon: Headphones },
  ];

  const marqueeContent = (
    <div className="flex items-center gap-8 shrink-0">
      <span className="flex items-center gap-2">
        <Truck className="w-4 h-4 text-[#00a3ff]" />
        توصيل لكافة مناطق فلسطين والداخل المحتل 🚚 | ضمان حقيقي لمدة سنة على جميع المنتجات ⭐
      </span>
      <span className="text-[#00e5ff]">✦</span>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] font-extrabold">
        NITRO GAMES: خياركم الأفضل في فلسطين للعتاد الاحترافي.. ارفع مستوى لعبك!
      </span>
      <span className="text-[#00a3ff]">✦</span>
      <span className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
        خدمة توصيل سريعة وبضائع أصلية 100%
      </span>
      <span className="text-[#00e5ff]">✦</span>
      <span className="bg-[#00a3ff]/20 text-[#00a3ff] px-2.5 py-0.5 rounded-full border border-[#00a3ff]/40 font-mono text-[11px]">
        كود خصم فوري: NITRO10 (وفر 10%)
      </span>
      <span className="text-[#00a3ff]">✦</span>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <style jsx global>{`
        @keyframes customMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        .animate-continuous-marquee {
          display: flex;
          width: max-content;
          animation: customMarquee 25s linear infinite;
        }
        .animate-continuous-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ===== 1. الشريط العلوي المتحرك ===== */}
      <div className="relative bg-[#070b14] border-b border-[#00a3ff]/30 text-white text-xs font-semibold py-2 overflow-hidden shadow-[0_4px_25px_rgba(0,163,255,0.2)]">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-2">
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-continuous-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold text-gray-200">
              {marqueeContent}
              {marqueeContent}
            </div>
          </div>
        </div>
      </div>

      {/* ===== 2. شريط القوائم الرئيسي (اللوجو، الأدوات، السلة، الأدمن) ===== */}
      <div className="bg-[#05070d]/98 backdrop-blur-xl border-b border-[#1c2942] shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          
          {/* 1. اللوجو */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#0b1120] border border-[#1c2942] flex items-center justify-center shadow-[0_0_15px_rgba(0,163,255,0.2)]">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#00a3ff]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs sm:text-base text-white font-black tracking-wider">
                  NITRO <span className="text-[#00a3ff]">GAMES</span>
                </span>
              </div>
              <span className="text-[8px] text-gray-400 tracking-widest font-mono">PALESTINE</span>
            </div>
          </a>

          {/* 2. أقسام المتجر للكمبيوتر */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0b1120] p-1.5 rounded-xl border border-[#1c2942]">
            <a href="#hero" className="px-3 py-1.5 text-xs font-bold text-gray-200 hover:text-[#00a3ff]">
              الرئيسية
            </a>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="px-3 py-1.5 text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Icon className="w-3.5 h-3.5 text-[#00a3ff]" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. خيارات اليمين (الأدوات على الجوال والكمبيوتر) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* زر البحث */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl bg-[#0b1120] border border-[#1c2942] text-gray-300 hover:text-[#00a3ff]"
              title="البحث"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* زر لوحة المشرف (ظاهر دائماً على الجوال والكمبيوتر) */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 px-2 sm:px-3 py-2 rounded-xl bg-[#0b1120] hover:bg-[#00a3ff] border border-[#1c2942] text-gray-300 hover:text-black transition-all text-xs font-bold cursor-pointer"
                title="لوحة تحكم المشرف"
              >
                <Lock className="w-3.5 h-3.5 text-[#00a3ff]" />
                <span className="hidden sm:inline">لوحة المشرف</span>
              </button>
            )}

            {/* زر المفضلة */}
            <a
              href="#products"
              onClick={() => onCategorySelect?.("all")}
              className="relative p-2 rounded-xl bg-[#0b1120] border border-[#1c2942] text-gray-300 hover:text-[#00e5ff]"
              title="المفضلة"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00e5ff] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </a>

            {/* زر سلة المشتريات (ظاهر دائماً وبوضوح) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl bg-[#0b1120] border border-[#00a3ff]/40 text-white shadow-[0_0_10px_rgba(0,163,255,0.2)]"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#00a3ff]" />
              {totalItemsCount > 0 && (
                <span className="bg-[#00a3ff] text-black font-black text-[10px] px-1.5 py-0.2 rounded-full">
                  {totalItemsCount}
                </span>
              )}
              <span className="hidden md:inline text-xs font-mono font-bold">{total} ₪</span>
            </button>

            {/* زر قائمة الجوال (Hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#0b1120] border border-[#1c2942] text-gray-300 hover:text-[#00a3ff]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* خانة البحث المنبثقة للجوال */}
        {searchOpen && (
          <div className="px-4 pb-3 pt-1 border-t border-[#1c2942] bg-[#070b14]">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن كيبورد، ماوس، ماوس باد..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                className="w-full bg-[#101a2e] text-sm text-gray-100 placeholder-gray-500 rounded-xl pl-10 pr-4 py-2 border border-[#1c2942] focus:outline-none focus:border-[#00a3ff]"
                autoFocus
              />
              <button type="submit" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* القائمة المنبثقة للجوال */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#05070d] border-t border-[#1c2942] px-5 py-4 space-y-3 shadow-2xl">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onCategorySelect?.("all");
                  setMobileMenuOpen(false);
                }}
                className="text-right py-2 text-sm font-bold text-gray-200 border-b border-[#1c2942]"
              >
                جميع الأقسام
              </button>
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="flex items-center gap-2 py-2 text-sm font-bold text-gray-300 text-right"
                  >
                    <Icon className="w-4 h-4 text-[#00a3ff]" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
