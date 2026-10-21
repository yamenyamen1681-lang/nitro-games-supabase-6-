"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Heart, Eye, Star } from "lucide-react";

interface ProductCardProps {
  product: Product & { isNew?: boolean; discount?: number };
  index?: number;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index, onQuickView }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const isWishlisted = wishlist.some((item: any) =>
    typeof item === "object" && item !== null ? item.id === product.id : item === product.id
  );

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl p-[1px] bg-gradient-to-b from-[#00a3ff]/30 via-[#16223a] to-[#16223a] hover:from-[#00e5ff] hover:via-[#00a3ff]/50 hover:to-[#0047ff]/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(0,163,255,0.5)]">
      <div className="relative flex flex-col justify-between flex-grow rounded-[15px] bg-[#060c18] overflow-hidden">

        {/* شارات المنتج */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 items-end">
          {product.isNew && (
            <span className="bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-[0_0_10px_#00e5ff] font-mono">
              NEW
            </span>
          )}
          {!!product.discount && (
            <span className="bg-[#00a3ff]/15 text-[#00e5ff] border border-[#00e5ff]/40 backdrop-blur-md font-black text-[10px] px-2.5 py-0.5 rounded-full font-mono">
              خصم {product.discount}%
            </span>
          )}
        </div>

        {/* زر المفضلة */}
        <button
          onClick={() => toggleWishlist(product.id as any)}
          className={`absolute top-3 left-3 z-20 p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
            isWishlisted
              ? "bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_10px_#00e5ff]"
              : "bg-black/50 border-white/10 text-gray-300 hover:text-white hover:border-[#00a3ff]"
          }`}
          aria-label="المفضلة"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#00e5ff]" : ""}`} />
        </button>

        {/* صورة المنتج */}
        <div
          className="relative h-48 sm:h-56 w-full overflow-hidden bg-gradient-to-b from-[#081226] to-[#03060f] cursor-pointer"
          onClick={() => onQuickView?.(product)}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00e5ff]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,163,255,0.22),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src={product.image || "/images/placeholder.jpg"}
            alt={product.title}
            fill
            className="object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060c18] via-transparent to-transparent opacity-80" />
        </div>

        {/* التفاصيل */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between text-right">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[#00a3ff] font-mono font-bold tracking-wider uppercase text-[10px]">
                {product.category || "GAMING GEAR"}
              </span>
              <div className="flex items-center gap-1 text-[#00e5ff]">
                <Star className="w-3.5 h-3.5 fill-[#00e5ff]" />
                <span className="font-mono text-gray-300 text-xs">4.9</span>
              </div>
            </div>

            <h3
              onClick={() => onQuickView?.(product)}
              className="text-sm sm:text-base font-black text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1 cursor-pointer font-['Cairo']"
            >
              {product.title}
            </h3>

            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {product.description || "عتاد احترافي عالي الأداء مصمم خصيصاً للاعبين المحترفين في فلسطين."}
            </p>
          </div>

          {/* السعر وأزرار الشراء */}
          <div className="mt-4 pt-3 border-t border-[#16223a] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400">السعر</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-lg font-black font-mono bg-gradient-to-r from-white to-[#00e5ff] bg-clip-text text-transparent">
                  {product.price}
                </span>
                <span className="text-xs font-bold text-[#00a3ff]">₪</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onQuickView && (
                <button
                  onClick={() => onQuickView(product)}
                  className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#00a3ff] text-gray-300 hover:text-[#00e5ff] transition-all cursor-pointer"
                  title="معاينة سريعة"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => addToCart(product)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-[#02121f] font-black text-xs shadow-[0_0_14px_rgba(0,229,255,0.35)] hover:shadow-[0_0_22px_rgba(0,229,255,0.7)] transition-all cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة للسلة</span>
              </button>
            </div>
          </div>
        </div>

        {/* خط إضاءة سفلي عند التحويم */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#00e5ff]" />
      </div>
    </div>
  );
};
