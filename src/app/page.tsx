"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Star,
  Zap,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Headphones,
  CreditCard,
  MessageCircle,
  Search,
  ShoppingCart,
  Menu,
} from "lucide-react";

export default function NitroGamesLanding() {
  const [activeSlide, setActiveSlide] = useState(0);

  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#00d9ff]" />,
      big: "1 سنة",
      small: "ضمان حقيقي",
    },
    {
      icon: <Truck className="w-5 h-5 text-[#00d9ff]" />,
      big: "24 48 ساعة",
      small: "شحن سريع خلال",
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#00d9ff]" />,
      big: "100%",
      small: "منتجات أصلية",
    },
    {
      icon: <Star className="w-5 h-5 text-[#00d9ff] fill-[#00d9ff]/20" />,
      big: "5,400+",
      small: "عميل يثق بنا",
    },
  ];

  const serviceHighlights = [
    {
      icon: <Truck className="w-5 h-5 text-[#00d9ff]" />,
      title: "توصيل لجميع المدن",
      desc: "في فلسطين",
    },
    {
      icon: <CreditCard className="w-5 h-5 text-[#00d9ff]" />,
      title: "دفع آمن",
      desc: "متوفر عدة طرق",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#00d9ff]" />,
      title: "ضمان حقيقي",
      desc: "على جميع المنتجات",
    },
    {
      icon: <Headphones className="w-5 h-5 text-[#00d9ff]" />,
      title: "دعم فني",
      desc: "خدمة سريعة ومتميزة",
    },
  ];

  return (
    <div className="min-h-screen bg-[#020813] text-white font-['Cairo',sans-serif] dir-rtl selection:bg-[#00d9ff] selection:text-black">
      
      {/* ===== HEADER / NAVBAR ===== */}
      <header className="border-b border-[#0a2038] bg-[#020813]/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-gray-300 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#00d9ff]/30 bg-[#00d9ff]/10">
              <Zap className="w-4 h-4 text-[#00d9ff]" />
              <span className="text-xs font-bold text-[#00d9ff] tracking-wide">CYBER ESPORTS</span>
            </div>
          </div>

          <span className="hidden md:inline-block text-xs text-gray-400">
            المتجر الأول لطرفيات الجيمينج الاحترافية في فلسطين
          </span>

          <div className="flex items-center gap-4">
            <button className="text-gray-300 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button className="relative p-1 text-gray-300 hover:text-white">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-[#00a8ff] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-6">

        {/* ===== HERO SECTION ===== */}
        <section className="relative rounded-2xl overflow-hidden border border-[#00a8ff]/30 bg-gradient-to-r from-[#010a17] via-[#04172c] to-[#010814] p-6 lg:p-10 min-h-[320px] flex items-center">
          
          {/* Background Glows */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#00d9ff]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-[#00a8ff]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full relative z-10">
            
            {/* Left Image Showcase (Responsive Order) */}
            <div className="md:col-span-5 order-2 md:order-1 relative h-48 md:h-64 w-full rounded-xl overflow-hidden border border-[#00d9ff]/20">
              <Image
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                alt="Nitro Games Showcase"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Right Branding & Copy */}
            <div className="md:col-span-7 order-1 md:order-2 text-right space-y-4">
              <div className="flex items-center gap-3 justify-start dir-ltr">
                <div className="w-10 h-10 rounded-xl bg-[#00d9ff]/10 border border-[#00d9ff]/40 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-[#00d9ff]" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-wider">
                    NITRO <span className="text-[#00d9ff]">GAMES</span>
                  </h1>
                  <p className="text-[10px] text-gray-400 font-mono tracking-widest">
                    PALESTINE · ESPORTS GEAR
                  </p>
                </div>
              </div>

              <h2 className="text-xl md:text-3xl font-black text-white flex items-center gap-2">
                <span>عتادك الاحترافي يبدأ من هنا</span>
                <span className="text-lg">🎮</span>
              </h2>

              <p className="text-sm text-gray-300">
                ارفع مستوى لعبك مع <span className="text-[#00d9ff] font-bold">Nitro Games</span>
              </p>

              <div className="pt-2">
                <button className="bg-[#00a8ff] hover:bg-[#0090e0] text-black font-extrabold px-7 py-2.5 rounded-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,168,255,0.4)]">
                  <span>تسوق الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* ===== 4-CARD FEATURE ROW ===== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-[#041224]/80 border border-[#0a2847] rounded-xl p-3.5 flex flex-col items-center justify-center text-center space-y-1.5 backdrop-blur-md hover:border-[#00d9ff]/50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-[#00d9ff]/10 border border-[#00d9ff]/20">
                {f.icon}
              </div>
              <span className="text-sm md:text-base font-black text-white tracking-tight">
                {f.big}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {f.small}
              </span>
            </div>
          ))}
        </section>

        {/* ===== FEATURED PRODUCT / LATEST ARRIVALS ===== */}
        <section className="space-y-3">
          
          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-[#0a2440] pb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00d9ff]" />
              <h3 className="text-lg font-bold text-white">أحدث المنتجات</h3>
            </div>
            <p className="text-xs text-gray-400">أفضل الأجهزة والإكسسوارات لعشاق الألعاب</p>
          </div>

          {/* Featured Product Card Slider */}
          <div className="relative bg-[#030f1e] border border-[#0b294a] rounded-2xl p-4 md:p-6 overflow-hidden">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Product Image Side */}
              <div className="md:col-span-5 relative">
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#00a8ff]/30">
                  <Image
                    src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1000&auto=format&fit=crop"
                    alt="كيبورد ميكانيكال"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-[#00a8ff] text-black font-extrabold text-[10px] px-2.5 py-1 rounded-full">
                    🔥 الأكثر مبيعاً
                  </span>
                </div>
              </div>

              {/* Product Info Side */}
              <div className="md:col-span-7 space-y-4 text-right">
                <div>
                  <h4 className="text-lg md:text-xl font-black text-white">
                    كيبورد ميكانيكال للألعاب
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    RGB | Switch Blue
                  </p>
                </div>

                {/* Specs Pill List */}
                <div className="grid grid-cols-3 gap-2 py-1">
                  <div className="bg-[#06182e] border border-[#0e355c] rounded-lg p-2 text-center">
                    <span className="block text-[10px] text-gray-400">تصميم مريح</span>
                    <span className="text-[11px] font-bold text-gray-200">للعب الطويل</span>
                  </div>
                  <div className="bg-[#06182e] border border-[#0e355c] rounded-lg p-2 text-center">
                    <span className="block text-[10px] text-gray-400">إضاءة RGB</span>
                    <span className="text-[11px] font-bold text-gray-200">متعددة الألوان</span>
                  </div>
                  <div className="bg-[#06182e] border border-[#0e355c] rounded-lg p-2 text-center">
                    <span className="block text-[10px] text-gray-400">مفاتيح ميكانيكية</span>
                    <span className="text-[11px] font-bold text-gray-200">سريعة الاستجابة</span>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#00d9ff] font-mono">$89</span>
                    <span className="text-xs text-gray-500 line-through font-mono">$120</span>
                  </div>

                  <button className="bg-[#00a8ff] hover:bg-[#0090e0] text-black font-extrabold px-5 py-2 rounded-xl flex items-center gap-2 text-xs transition-transform hover:scale-105 active:scale-95">
                    <ShoppingBag className="w-4 h-4" />
                    <span>أضف إلى السلة</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#09203a]">
              <button
                onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
                className="p-1 rounded-lg bg-[#06182e] text-gray-400 hover:text-white border border-[#0e355c]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === activeSlide ? "w-5 bg-[#00d9ff]" : "w-1.5 bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveSlide((prev) => Math.min(3, prev + 1))}
                className="p-1 rounded-lg bg-[#06182e] text-gray-400 hover:text-white border border-[#0e355c]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

        {/* ===== BOTTOM FOOTER SERVICES STRIP ===== */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {serviceHighlights.map((s, idx) => (
            <div
              key={idx}
              className="bg-[#030c18] border border-[#0a2038] rounded-xl p-3 flex flex-col items-center text-center space-y-1"
            >
              <div className="p-1.5 rounded-lg bg-[#00d9ff]/10">
                {s.icon}
              </div>
              <h5 className="text-xs font-bold text-white mt-1">{s.title}</h5>
              <p className="text-[10px] text-gray-400">{s.desc}</p>
            </div>
          ))}
        </section>

      </main>

      {/* ===== FOOTER BRANDING & WHATSAPP ===== */}
      <footer className="max-w-7xl mx-auto px-4 py-6 border-t border-[#091a2e] mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        
        <div className="flex items-center gap-3 dir-ltr">
          <span className="font-bold text-gray-400">NITRO GAMES</span>
          <span>·</span>
          <span>PLAY HARDER</span>
        </div>

        <a
          href="https://wa.me/972595852044"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#031d14] border border-[#00ff88]/30 text-[#00ff88] font-bold hover:bg-[#052b1e] transition-colors"
        >
          <span>تواصل معنا</span>
          <MessageCircle className="w-4 h-4" />
        </a>

      </footer>

    </div>
  );
}
