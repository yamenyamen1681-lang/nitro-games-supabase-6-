"use client";

import React from "react";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Eye, Star, ShieldCheck, Zap } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setQuickViewProduct } = useCart();

  const isWishlisted = wishlist.some((id) => id === product.id);

  // حساب نسبة الخصم
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="group relative bg-[#070b14]/90 hover:bg-[#0b1120] border border-[#1c2942] hover:border-[#00a3ff] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(0,163,255,0.3)] hover:-translate-y-1.5 overflow-hidden">
      
      {/* إضاءة خلفية نيون متحركة للمنتج */}
      <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#00a3ff]/10 rounded-full blur-3xl group-hover:bg-[#00a3ff]/25 transition-all pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#00e5ff]/10 rounded-full blur-3xl group-hover:bg-[#00e5ff]/20 transition-all pointer-events-none" />

      {/* ===== 1. الشريط العلوي: تصنيف المنتج، الخصم، والأزرار السريعة ===== */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {product.category && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#00a3ff]/10 border border-[#00a3ff]/30 text-[10px] font-bold text-[#00a3ff] uppercase tracking-wider">
              {product.category}
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/40 text-[10px] font-black text-red-400">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* أزرار التفاعل (نظرة سريعة والمفضلة) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-1.5 rounded-lg bg-[#0b1120] border border-[#1c2942] text-gray-400 hover:text-white hover:border-[#00a3ff] transition-all"
            title="نظرة سريعة"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-1.5 rounded-lg border transition-all ${
              isWishlisted
                ? "bg-red-500/20 border-red-500/50 text-red-500"
                : "bg-[#0b1120] border-[#1c2942] text-gray-400 hover:text-red-400"
            }`}
            title="المفضلة"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* ===== 2. الماركة واسم المنتج (في المنتصف أعلى الصورة مباشرة) ===== */}
      <div className="relative z-10 text-center my-2 space-y-1">
        {product.brand && (
          <span className="text-[11px] font-black tracking-widest text-[#00e5ff] uppercase block drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">
            {product.brand}
          </span>
        )}
        <h3
          onClick={() => setQuickViewProduct(product)}
          className="text-base font-black text-white hover:text-[#00a3ff] cursor-pointer transition-colors leading-tight line-clamp-1"
        >
          {product.title}
        </h3>
      </div>

      {/* ===== 3. صورة الكيبورد / المنتج ===== */}
      <div
        onClick={() => setQuickViewProduct(product)}
        className="relative z-10 w-full aspect-square rounded-xl bg-[#030509]/80 border border-[#1c2942] overflow-hidden flex items-center justify-center p-3 cursor-pointer group-hover:border-[#00a3ff]/40 transition-all shadow-inner my-1"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          loading="lazy"
        />

        {/* مؤشر متوفر بالمخزن */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#070b14]/90 border border-[#1c2942] flex items-center gap-1 text-[9px] text-emerald-400 font-bold backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          متوفر
        </div>
      </div>

      {/* ===== 4. التفاصيل والضمان والتسعير ===== */}
      <div className="relative z-10 mt-2 space-y-2">
        {/* الضمان والتقييم */}
        <div className="flex items-center justify-between text-[11px] px-1">
          <div className="flex items-center gap-1 text-[#00a3ff] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ضمان سنة</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{product.rating || "5.0"}</span>
          </div>
        </div>

        {/* السعر وزر الإضافة للسلة */}
        <div className="pt-2 border-t border-[#1c2942]/60 flex items-center justify-between gap-2">
          {/* عرض السعر */}
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-gray-500 line-through font-mono">
                {product.originalPrice} ₪
              </span>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-white font-mono leading-none tracking-tight">
                {product.price}
              </span>
              <span className="text-xs font-bold text-[#00a3ff]">₪</span>
            </div>
          </div>

          {/* زر أضف للسلة */}
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00a3ff] via-[#0080ff] to-[#0055ff] hover:from-[#00b4ff] hover:to-[#0066ff] text-black font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,163,255,0.4)] active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>أضف للسلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
