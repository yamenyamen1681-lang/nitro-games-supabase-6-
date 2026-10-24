"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { Sparkles, ArrowUpDown, Keyboard, Mouse, Square, Mic, Headphones, Flame, Zap, ShieldCheck, BadgeCheck, Truck, ChevronDown } from "lucide-react";

interface ProductSectionProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onQuickView?: (product: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onQuickView,
}) => {
  const [filterTab, setFilterTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");

  const filterTabs = [
    { id: "all", label: "جميع الأقسام", icon: Sparkles },
    { id: "keyboards", label: "كيبورد", icon: Keyboard },
    { id: "mice", label: "ماوس", icon: Mouse },
    { id: "mousepads", label: "ماوس باد", icon: Square },
    { id: "microphones", label: "مايك", icon: Mic },
    { id: "headsets", label: "سماعات", icon: Headphones },
    { id: "bestseller", label: "الأكثر طلباً", icon: Flame },
  ];

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory && selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    } else if (filterTab === "bestseller") {
      list = list.filter((p) => p.isFeatured || (p.discountPercent && p.discountPercent >= 16));
    } else if (filterTab !== "all") {
      list = list.filter((p) => p.category === filterTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
  }, [products, selectedCategory, filterTab, searchQuery, sortBy]);

  const resetFilters = () => {
    onSelectCategory("all");
    setFilterTab("all");
  };

  return (
    <section
      id="products"
      className="relative py-12 sm:py-16 bg-gradient-to-b from-[#050914]/90 via-[#040812]/90 to-[#03060f]/90"
    >
      <style>{`
        @property --psA { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        @keyframes psSpin { to { --psA: 360deg; } }
        .ps-frame {
          background: conic-gradient(from var(--psA), #00e5ff, #0047ff 25%, #04101f 45%, #00a3ff 65%, #00e5ff 85%, #00e5ff);
          animation: psSpin 7s linear infinite;
        }
        @keyframes psShimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .ps-shimmer { background-size: 200% auto; animation: psShimmer 4s linear infinite; filter: drop-shadow(0 0 16px rgba(0,229,255,.4)); }
        @media (prefers-reduced-motion: reduce) { .ps-frame, .ps-shimmer { animation: none; } }
      `}</style>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00a3ff]/60 to-transparent" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{ background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,163,255,0.14), transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            {/* الشارة: إطار ضوئي يدور */}
            <div className="ps-frame mb-5 inline-flex rounded-full p-[1.5px] shadow-[0_0_26px_rgba(0,163,255,0.3)]">
              <div className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#050c1c] via-[#08183a] to-[#050c1c] px-4 py-2">
                <Zap className="h-4 w-4 fill-[#00a3ff]/40 text-[#00e5ff]" />
                <span className="font-['Cairo'] text-xs font-black tracking-wide text-white">
                  كتالوج الأجهزة والعتاد الاحترافي
                </span>
              </div>
            </div>

            {/* العنوان الرئيسي */}
            <h2 className="font-['Cairo'] font-black leading-[1.25]">
              <span className="block bg-gradient-to-b from-white to-[#bfeeff] bg-clip-text text-4xl text-transparent drop-shadow-[0_4px_22px_rgba(0,163,255,0.35)] sm:text-6xl">
                عتاد الجيمينج الأصلي
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-x-3 text-3xl sm:text-5xl">
                <span className="text-gray-300 font-light">مع</span>
                <span className="ps-shimmer bg-gradient-to-r from-[#0047ff] via-[#00e5ff] to-[#d6f7ff] bg-clip-text text-transparent">
                  كفالة سنة كاملة
                </span>
                <ShieldCheck className="h-8 w-8 text-[#00e5ff] drop-shadow-[0_0_12px_#00e5ff] sm:h-11 sm:w-11" />
              </span>
            </h2>

            <div className="mt-4 flex items-center gap-2">
              <span className="h-[3px] w-24 rounded-full bg-gradient-to-r from-[#00e5ff] to-[#0047ff] shadow-[0_0_12px_#00e5ff]" />
              <span className="h-[3px] w-6 rounded-full bg-[#00a3ff]/50" />
              <span className="h-[3px] w-2 rounded-full bg-[#00a3ff]/30" />
            </div>

            {/* الوصف: كرت زجاجي بشريط جانبي مضيء */}
            <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#16294a] bg-gradient-to-l from-[#0a1630]/90 to-[#060e1f]/70 py-4 pr-5 pl-4 backdrop-blur-sm">
              <span className="absolute inset-y-3 right-0 w-[3px] rounded-full bg-gradient-to-b from-[#00e5ff] to-[#0047ff] shadow-[0_0_12px_#00e5ff]" />
              <p className="font-['Cairo'] text-[13px] leading-loose text-gray-300 sm:text-sm">
                تصفّح <b className="font-black text-[#00e5ff]">الكيبوردات</b>،{" "}
                <b className="font-black text-[#00e5ff]">الماوسات</b>،{" "}
                <b className="font-black text-[#00e5ff]">الماوس باد</b>،{" "}
                <b className="font-black text-[#00e5ff]">المايكات</b>، و
                <b className="font-black text-[#00e5ff]">السماعات</b> المعتمدة لدى محترفي الرياضات الإلكترونية.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  { icon: BadgeCheck, text: "أصلي 100%" },
                  { icon: ShieldCheck, text: "كفالة سنة" },
                  { icon: Truck, text: "توصيل لكل المناطق" },
                ].map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className="flex items-center gap-1.5 rounded-lg border border-[#00a3ff]/30 bg-[#00a3ff]/10 px-2.5 py-1 font-['Cairo'] text-[11px] font-bold text-[#9fe9ff]"
                  >
                    <Icon className="h-3.5 w-3.5 text-[#00e5ff]" />
                    {text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* الترتيب */}
          <label className="relative flex w-full cursor-pointer items-center gap-2.5 self-start rounded-2xl border border-[#1d3563] bg-gradient-to-b from-[#0a1630] to-[#060e1f] px-4 py-3 shadow-[0_0_18px_rgba(0,163,255,0.15)] transition-all hover:border-[#00a3ff] md:w-auto md:self-auto">
            <ArrowUpDown className="h-4 w-4 shrink-0 text-[#00e5ff]" />
            <span className="shrink-0 font-['Cairo'] text-[11px] font-bold text-gray-400">ترتيب حسب</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pl-6 font-['Cairo'] text-xs font-black text-white focus:outline-none"
            >
              <option value="popular" className="bg-[#08122a]">الأكثر طلباً وشعبية</option>
              <option value="rating" className="bg-[#08122a]">الأعلى تقييماً (5 نجوم)</option>
              <option value="price_asc" className="bg-[#08122a]">السعر: من الأقل للأعلى</option>
              <option value="price_desc" className="bg-[#08122a]">السعر: من الأعلى للأقل</option>
            </select>
            <ChevronDown className="pointer-events-none absolute left-4 h-4 w-4 text-[#00a3ff]" />
          </label>
        </div>

        {/* التبويبات */}
        <div className="-mx-4 sm:mx-0 mb-8 px-4 sm:px-0">
          <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive =
                selectedCategory === "all" || !selectedCategory
                  ? filterTab === tab.id
                  : selectedCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onSelectCategory("all");
                    setFilterTab(tab.id);
                  }}
                  className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-2 font-['Cairo'] ${
                    isActive
                      ? "bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] text-[#02121f] shadow-[0_0_22px_rgba(0,229,255,0.5)] border border-white/30"
                      : "bg-[#08122a]/80 text-gray-300 border border-[#16294a] hover:border-[#00a3ff]/60 hover:text-white hover:shadow-[0_0_14px_rgba(0,163,255,0.25)]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* مؤشر البحث / الفلترة */}
        {(searchQuery || (selectedCategory && selectedCategory !== "all")) && (
          <div className="mb-6 flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#08122a]/80 border border-[#16294a] text-xs">
            <span className="text-gray-300 font-['Cairo']">
              {searchQuery && `نتائج البحث عن: "${searchQuery}"`}
              {selectedCategory && selectedCategory !== "all" && ` • القسم المحدد: ${selectedCategory}`}
              {` (${filteredProducts.length} منتج)`}
            </span>
            <button onClick={resetFilters} className="shrink-0 text-[#00e5ff] hover:underline font-bold cursor-pointer">
              إلغاء الفلترة وعرض الكل
            </button>
          </div>
        )}

        {/* عداد النتائج */}
        {filteredProducts.length > 0 && (
          <div className="mb-5 flex items-center gap-3 text-xs text-gray-400 font-['Cairo']">
            <span className="font-tech font-black text-[#00e5ff]">{filteredProducts.length}</span>
            <span>منتج متاح</span>
            <span className="h-px flex-1 bg-gradient-to-r from-[#16294a] to-transparent" />
          </div>
        )}

        {/* الشبكة */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onQuickView={onQuickView} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-3xl bg-[#08122a]/80 border border-[#16294a] space-y-3">
            <div className="text-4xl">⚡</div>
            <h3 className="text-lg font-bold text-white font-['Cairo']">لم يتم العثور على منتجات مطابقة</h3>
            <p className="text-xs text-gray-400">جرّب البحث بكلمات أخرى أو اختر قسماً آخر من الأقسام الخمسة.</p>
            <button
              onClick={resetFilters}
              className="mt-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] text-[#02121f] font-black text-xs shadow-[0_0_20px_rgba(0,163,255,0.5)] cursor-pointer font-['Cairo']"
            >
              عرض جميع الأقسام
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
