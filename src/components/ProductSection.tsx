"use client";

import React, { useState, useMemo } from "react";
import { Product } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { Sparkles, ArrowUpDown, Keyboard, Mouse, Square, Mic, Headphones, Flame, Zap } from "lucide-react";

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
      className="relative py-16 bg-gradient-to-b from-[#050914]/90 via-[#040812]/90 to-[#03060f]/90"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00a3ff]/60 to-transparent" />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48"
        style={{ background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(0,163,255,0.14), transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00a3ff]/35 bg-[#00a3ff]/10 px-3.5 py-1.5 mb-3">
              <Zap className="w-3.5 h-3.5 text-[#00e5ff] fill-[#00a3ff]/40" />
              <span className="text-[11px] font-bold text-[#00e5ff] tracking-wide font-['Cairo']">
                كتالوج الأجهزة والعتاد الاحترافي
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Cairo'] leading-snug">
              عتاد الجيمينج الأصلي مع{" "}
              <span className="bg-gradient-to-r from-[#00a3ff] via-[#00e5ff] to-[#9fe9ff] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(0,229,255,0.4)]">
                كفالة سنة كاملة
              </span>
            </h2>

            <div className="mt-3 flex items-center gap-3">
              <span className="h-[3px] w-16 rounded-full bg-gradient-to-r from-[#00e5ff] to-[#0047ff] shadow-[0_0_10px_#00e5ff]" />
              <span className="h-[3px] w-3 rounded-full bg-[#00a3ff]/50" />
              <span className="h-[3px] w-1.5 rounded-full bg-[#00a3ff]/30" />
            </div>

            <p className="text-xs sm:text-sm text-gray-400 mt-3 max-w-xl leading-relaxed">
              تصفح الكيبوردات، الماوسات، الماوس باد، المايكات، والسماعات المعتمدة لدى محترفي الرياضات الإلكترونية.
            </p>
          </div>

          {/* الترتيب */}
          <div className="flex items-center gap-2 self-start md:self-auto rounded-2xl border border-[#16294a] bg-[#08122a]/80 px-3 py-2">
            <ArrowUpDown className="w-4 h-4 text-[#00a3ff]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-100 focus:outline-none cursor-pointer font-['Cairo']"
            >
              <option value="popular" className="bg-[#08122a]">الأكثر طلباً وشعبية</option>
              <option value="rating" className="bg-[#08122a]">الأعلى تقييماً (5 نجوم)</option>
              <option value="price_asc" className="bg-[#08122a]">السعر: من الأقل للأعلى</option>
              <option value="price_desc" className="bg-[#08122a]">السعر: من الأعلى للأقل</option>
            </select>
          </div>
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
