"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Heart, Eye, Star, Zap } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number; // أضفنا هذه الخاصية هنا لكي يتوافق مع تمريرها من ProductSection بدون أخطاء
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index, onQuickView }) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <div className="group relative bg-[#060c18] border border-[#16223a] hover:border-[#00e5ff] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)] flex flex-col justify-between">
      
      {/* شريط علوي لخصائص المنتج (سريع / حصري) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 items-end">
        {product.isNew && (
          <span className="bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black font-black text-[10px] px-2.5 py-0.5 rounded-full shadow-[0_0_10px_#00e5ff] font-mono">
            NEW
          </span>
        )}
        {product.discount && (
          <span className="bg-red-500/20 text-red-400 border border-red-500/40 font-black text-[10px] px-2.5 py-0.5 rounded-full font-mono">
            خصم {product.discount}%
          </span>
        )}
      </div>

      {/* زر المفضلة (Heart) */}
      <button
        onClick={() => toggleWishlist(product)}
        className={`absolute top-3 left-3 z-25 p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer ${
          isWishlisted
            ? "bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_10px_#00e5ff]"
            : "bg-black/60 border-white/10 text-gray-300 hover:text-white hover:border-[#00a3ff]"
        }`}
        aria-label="المفضلة"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#00e5ff]" : ""}`} />
      </button>

      {/* صورة المنتج مع تأثير التكبير */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#03060f] cursor-pointer" onClick={() => onQuickView?.(product)}>
        <Image
          src={product.image || "/images/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover object-center group-hover:scale-110 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060c18] via-transparent to-transparent opacity-80" />
      </div>

      {/* تفاصيل المنتج */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between text-right">
        <div>
          {/* تصنيف المنتج والتقييم */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#00a3ff] font-mono font-bold tracking-wider uppercase text-[10px]">
              {product.category || "GAMING GEAR"}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="font-mono text-gray-300 text-xs">4.9</span>
            </div>
          </div>

          {/* اسم المنتج */}
          <h3 
            onClick={() => onQuickView?.(product)}
            className="text-sm sm:text-base font-black text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1 cursor-pointer font-['Cairo']"
          >
            {product.name}
          </h3>

          {/* وصف قصير */}
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description || "عتاد احترافي عالي الأداء مصمم خصيصاً للاعبين المحترفين في فلسطين."}
          </p>
        </div>

        {/* السعر وأزرار الشراء */}
        <div className="mt-4 pt-3 border-t border-[#16223a] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400">السعر</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black font-mono text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
                {product.price}
              </span>
              <span className="text-xs font-bold text-gray-300">₪</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onQuickView && (
              <button
                onClick={() => onQuickView(product)}
                className="p-2 rounded-xl bg-[#03060f] border border-[#16223a] hover:border-[#00a3ff] text-gray-300 hover:text-[#00e5ff] transition-all cursor-pointer"
                title="معاينة سريعة"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => addToCart(product)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] text-black font-black text-xs hover:shadow-[0_0_15px_#00e5ff] transition-all cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 fill-black" />
              <span>إضافة للسلة</span>
            </button>
          </div>
        </div>

      </div>

      {/* خط إضاءة نيون سفلي عند التحويم */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#00e5ff]" />
    </div>
  );
};
