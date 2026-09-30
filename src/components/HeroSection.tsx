"use client";

import React from "react";
import Image from "next/image";
import { Product, ShowcaseConfig, DEFAULT_SHOWCASE } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, ShieldCheck, Truck, ShoppingBag, Zap } from "lucide-react";

interface HeroSectionProps {
  products: Product[];
  showcase?: ShowcaseConfig;
  onCategorySelect?: (cat: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  products,
  showcase,
}) => {
  const { addToCart } = useCart();
  const cfg = showcase ?? DEFAULT_SHOWCASE;

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeProduct = products.length > 0 ? products[0] : null;

  return (
    <section id="hero" className="relative overflow-hidden pt-6 pb-6 bg-[#020914]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* MAIN HERO BOX */}
        <div className="rounded-2xl p-6 sm:p-10 bg-gradient-to-b from-[#081a30] to-[#030d1a] border border-[#00A8FF]/30 text-center space-y-6">
          
          {/* BRAND */}
          <div className="flex items-center justify-center gap-2">
            <div className="brand-mark brand-mark-lg text-white font-black text-2xl sm:text-3xl">
              NITRO <span className="brand-mark-games text-[#00D9FF]">GAMES</span>
            </div>
            <div className="p-2 rounded-xl bg-[#00A8FF]/10 border border-[#00A8FF]/20">
              <Zap className="w-5 h-5 text-[#00A8FF]" />
            </div>
          </div>

          <div className="text-xs text-gray-400 font-tech uppercase tracking-widest">
            PALESTINE · ESPORTS GEAR
          </div>

          {/* HEADLINE */}
          <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight font-['Cairo']">
            عتادك الاحترافي يبدأ من هنا 🎮
          </h1>

          <p className="text-sm sm:text-base text-gray-300">
            ارفع مستوى لعبك مع <span className="text-[#00D9FF] font-bold">Nitro Games</span>
          </p>

          {/* CTA BUTTON */}
          <div>
            <button
              onClick={() => scrollTo("products")}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#00D9FF] text-[#00101c] font-black text-sm hover:bg-[#00b3d6] transition-all"
            >
              <span>تسوق الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* SHOWCASE BOX */}
          <div className="mt-8 rounded-xl bg-[#020914] border border-[#00A8FF]/20 p-4 min-h-[220px] flex flex-col items-center justify-center relative overflow-hidden">
            {activeProduct ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-40 h-32">
                  <Image
                    src={activeProduct.image}
                    alt={activeProduct.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="text-white font-bold text-sm">
                  {activeProduct.title}
                </div>
                <div className="text-[#00D9FF] font-tech font-black">
                  {activeProduct.price} ₪
                </div>
              </div>
            ) : (
              <span className="text-gray-400 text-sm font-tech">
                Nitro Games Showcase
              </span>
            )}
          </div>

        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#081a30]/80 border border-[#00A8FF]/20 flex flex-col items-center text-center">
            <ShieldCheck className="w-6 h-6 text-[#00D9FF] mb-2" />
            <span className="text-white font-bold text-sm font-tech">1 سنة</span>
            <span className="text-gray-400 text-xs mt-1">ضمان حقيقي</span>
          </div>

          <div className="p-4 rounded-xl bg-[#081a30]/80 border border-[#00A8FF]/20 flex flex-col items-center text-center">
            <Truck className="w-6 h-6 text-[#00D9FF] mb-2" />
            <span className="text-white font-bold text-sm font-tech">24 48 ساعة</span>
            <span className="text-gray-400 text-xs mt-1">شحن سريع خلال</span>
          </div>
        </div>

      </div>
    </section>
  );
};
