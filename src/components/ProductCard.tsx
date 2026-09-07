"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, CATEGORIES_META } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Heart, Eye, Star, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const { addToCart, wishlist, toggleWishlist, setQuickViewProduct } = useCart();
  const isWishlisted = wishlist.includes(product.id);
  const catName = CATEGORIES_META.find((c) => c.id === product.category)?.name ?? product.category;

  const media: { type: "image" | "video"; url: string }[] = [
    { type: "image", url: product.image },
    ...(product.gallery ?? []),
  ];
  const [mediaIndex, setMediaIndex] = useState(0);
  const current = media[mediaIndex] ?? media[0];

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaIndex((i) => (i - 1 + media.length) % media.length);
  };
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMediaIndex((i) => (i + 1) % media.length);
  };

  return (
    <div className="group relative grad-frame flex flex-col justify-between overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00a3ff]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* index number badge */}
      <span className="absolute bottom-2 left-3 text-[42px] font-black font-tech text-white/[0.04] leading-none select-none pointer-events-none group-hover:text-[#00a3ff]/10 transition-colors">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Top row */}
      <div className="relative p-3 pb-0 z-10 flex items-start justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-tech text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/30 px-2 py-0.5 rounded-md">
            {catName}
          </span>
          {product.discountPercent ? (
            <span className="bg-[#00a3ff] text-black text-[10px] font-black px-2 py-0.5 rounded-md">
              -{product.discountPercent}%
            </span>
          ) : null}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`p-1.5 rounded-lg border transition-all ${
            isWishlisted
              ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
              : "bg-black/50 text-gray-400 hover:text-white border-[#22375a]"
          }`}
          aria-label="المفضلة"
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-rose-500" : ""}`} />
        </button>
      </div>

      {/* Media (image or video) with prev/next arrows when there's more than one item */}
      <div className="relative h-72 sm:h-80 w-full cursor-pointer px-4 flex items-center justify-center">
        <div
          className="relative w-full h-full"
          onClick={() => setQuickViewProduct(product)}
        >
          {current.type === "video" ? (
            <video
              key={current.url}
              src={current.url}
              muted
              loop
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <Image
              src={current.url}
              alt={product.title}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>

        <div className="absolute inset-0 bg-[#05070d]/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3.5 py-2 rounded-xl btn-ghost text-[11px] font-bold flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            نظرة سريعة
          </span>
        </div>

        {/* Prev/Next arrows — only when there's more than one media item */}
        {media.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="السابق"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 border border-[#22375a] text-white flex items-center justify-center hover:bg-[#00a3ff] hover:text-black transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              aria-label="التالي"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-black/60 border border-[#22375a] text-white flex items-center justify-center hover:bg-[#00a3ff] hover:text-black transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1">
              {media.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === mediaIndex ? "bg-[#00a3ff] w-4" : "bg-gray-500/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="p-4 pt-2 flex flex-col flex-grow justify-between text-right space-y-3 relative z-10">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-tech text-[#00a3ff] uppercase tracking-wider">
              {product.brand}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a3ff] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00a3ff]" />
              </span>
              متوفر
            </span>
          </div>

          <h3
            onClick={() => setQuickViewProduct(product)}
            className="text-xs sm:text-sm font-bold text-gray-100 line-clamp-2 hover:text-[#00a3ff] transition-colors cursor-pointer leading-snug font-['Cairo']"
          >
            {product.title}
          </h3>

          <p className="text-[10px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#182742]">
            <span className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="text-[11px] font-black text-gray-200 mr-1">{product.rating}</span>
            </span>
            <span className="text-[10px] text-gray-400 flex items-center gap-1 bg-[#152034] px-2 py-0.5 rounded border border-[#1e3050]">
              <ShieldCheck className="w-3 h-3 text-[#00e5ff]" />
              ضمان سنة ⭐
            </span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="pt-3 border-t border-[#182742] flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.originalPrice ? (
              <span className="text-[10px] text-gray-500 line-through font-mono">
                {product.originalPrice.toLocaleString()} ₪
              </span>
            ) : null}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white font-tech">
                {product.price.toLocaleString()}
              </span>
              <span className="text-[11px] font-black text-[#00a3ff]">₪</span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="btn-neon text-[11px] px-3 py-2.5 flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  );
};
