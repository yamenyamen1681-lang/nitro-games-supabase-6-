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

  // محتوى الشريط العلوي الموحد
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
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* CSS الخاص بالإنيميشن للـ Marquee المطبوع مباشرة */}
      <style jsx global>{`
        @keyframes customMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(50%);
          }
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

      {/* ===== 1. Announcement Bar (شريط الإعلانات اللانهائي) ===== */}
      <div className="relative bg-gradient-to-r from-[#070b14] via-[#0b1120] to-[#070b14] border-b border-[#00a3ff]/30 text-white text-xs font-semibold py-2.5 overflow-hidden shadow-[0_4px_25px_rgba(0,163,255,0.2)]">
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00a3ff] via-[#00e5ff] to-transparent animate-pulse z-10" />

        <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
          {/* الحاوية المتحركة بلا توقف */}
          <div className="flex-1 overflow-hidden relative">
            <div className="animate-continuous-marquee flex items-center gap-8 whitespace-nowrap text-xs font-bold text-gray-200">
              {/* تكرار المحتوى مرتين للحصول على إنيميشن مستمر بلا فراغات */}
              {marqueeContent}
              {marqueeContent}
            </div>
          </div>

          {/* خدمة العملاء للكمبيوتر */}
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-300 flex-shrink-0 mr-4 z-10 bg-[#070b14]/90 px-2 py-0.5 rounded-lg border border-[#1c2942]">
            <span className="text-gray-400">خدمة العملاء:</span>
            <a
              href={`https://wa.me/${STORE_CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="text-[#00a3ff] hover:text-white flex items-center gap-1 font-mono direction-ltr font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" /> {STORE_CONTACT.display}
            </a>
          </div>
        </div>
      </div>

      {/* ===== 2. Main Navbar ===== */}
      <div className="bg-[#05070d]/95 backdrop-blur-xl border-b border-[#1c2942] shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#0b1120] border border-[#1c2942] group-hover:border-[#00a3ff] flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(0,163,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,163,255,0.5)]">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#00a3ff] group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5ff]"></span>
              </span>
            </div>

            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="brand-mark text-sm sm:text-base text-white font-black tracking-wider">
                  NITRO <span className="text-[#00a3ff]">GAMES</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/30 font-tech">
                  PRO
                </span>
              </div>
              <span className="text-[9px] text-gray-400 tracking-widest font-mono">PALESTINE</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0b1120] p-1.5 rounded-xl border border-[#1c2942]">
            <a
              href="#hero"
              className="px-3.5 py-2 text-xs font-bold text-gray-200 hover:text-[#00a3ff] transition-colors rounded-lg hover:bg-[#101a2e]"
            >
              الرئيسية
            </a>
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className="px-3 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-[#101a2e] rounded-lg transition-all flex items-center gap-1.5 cursor-pointer group"
                >
                  <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#00a3ff] transition-colors" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search Bar for Desktop */}
          <div className="hidden xl:flex flex-1 max-w-xs mx-1">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن كيبورد، ماوس، ماوس باد..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                className="w-full bg-[#0b1120] text-xs text-gray-100 placeholder-gray-500 rounded-xl pl-9 pr-4 py-2.5 border border-[#1c2942] focus:outline-none focus:border-[#00a3ff] focus:ring-1 focus:ring-[#00a3ff] transition-all"
              />
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00a3ff] transition-colors"
                title="بحث"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#0b1120] border border-[#1c2942] text-xs font-bold text-gray-200"
              title="العملة الرسمية: شيكل فلسطيني (₪ ILS)"
            >
              <span className="text-[#00a3ff] font-black text-sm">₪</span>
              <span className="font-mono text-[11px]">ILS</span>
            </div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="xl:hidden p-2 sm:p-2.5 rounded-xl bg-[#0b1120] border border-[#1c2942] text-gray-300 hover:text-[#00a3ff] transition-colors"
              aria-label="البحث"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#0b1120] hover:bg-[#00a3ff] border border-[#1c2942] hover:border-[#00a3ff] text-gray-300 hover:text-black transition-all text-xs font-bold shadow-sm cursor-pointer group"
                title="لوحة تحكم المشرف"
              >
                <Lock className="w-3.5 h-3.5 text-[#00a3ff] group-hover:text-black transition-colors" />
                <span className="hidden sm:inline">لوحة المشرف</span>
              </button>
            )}

            <a
              href="#products"
              onClick={() => onCategorySelect?.("all")}
              className="relative p-2 sm:p-2.5 rounded-xl bg-[#0b1120] border border-[#1c2942] text-gray-300 hover:text-[#00e5ff] transition-colors"
              title="قائمة المفضلة"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#00e5ff] text-black text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  {wishlist.length}
                </span>
              )}
            </a>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#0b1120] hover:bg-[#101a2e] border border-[#00a3ff]/40 hover:border-[#00a3ff] text-white hover:shadow-[0_0_20px_rgba(0,163,255,0.3)] transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#00a3ff] group-hover:scale-110 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#00a3ff] text-black font-black text-[10px] sm:text-[11px] w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-[0_0_10px_#00a3ff]">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-right">
                <span className="text-[10px] text-gray-400 font-medium">السلة</span>
                <span className="text-xs font-black text-white font-mono">
                  {total.toLocaleString()} <span className="text-[#00a3ff]">₪</span>
                </span>
              </div>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[#0b1120] border border-[#1c2942] text-gray-300 hover:text-[#00a3ff] transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search for Mobile */}
        {searchOpen && (
          <div className="xl:hidden px-4 pb-3 pt-1 border-t border-[#1c2942] bg-[#070b14]">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن كيبورد، ماوس، ماوس باد، مايك..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                className="w-full bg-[#101a2e] text-sm text-gray-100 placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#1c2942] focus:outline-none focus:border-[#00a3ff]"
                autoFocus
              />
              <button
                type="submit"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00a3ff]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#05070d] border-t border-[#1c2942] px-5 py-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="grid grid-cols-2 gap-2 pb-4 border-b border-[#1c2942]">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0b1120] text-xs text-gray-300">
                <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
                <span>ضمان سنة كاملة ⭐</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0b1120] text-xs text-gray-300">
                <Truck className="w-4 h-4 text-[#00a3ff]" />
                <span>شحن سريع 🚚</span>
              </div>
            </div>

            <nav className="flex flex-col space-y-1.5">
              <button
                onClick={() => {
                  onCategorySelect?.("all");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-200 hover:text-[#00a3ff] hover:bg-[#0b1120] text-right w-full"
              >
                <span>جميع الأقسام</span>
              </button>

              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-gray-200 hover:text-[#00a3ff] hover:bg-[#0b1120] text-right w-full"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[#00a3ff]" />
                      <span>{cat.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[#1c2942] flex flex-col gap-2.5">
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#0b1120] border border-[#00a3ff]/40 text-[#00a3ff] font-bold flex items-center justify-center gap-2 text-xs cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>لوحة تحكم المشرف</span>
                </button>
              )}
              <a
                href={`https://wa.me/${STORE_CONTACT.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#00a3ff] hover:bg-[#008bd8] text-black font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                <PhoneCall className="w-4 h-4" /> طلب سريع عبر واتساب المتجر
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
