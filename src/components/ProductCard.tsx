"use client";

import React from "react";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { Heart, ShoppingBag, Eye, Star, ShieldCheck, Zap } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
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
    <div className="group relative bg-[#050914] hover:bg-[#080e1e] border-2 border-[#00a3ff]/40 hover:border-[#00e5ff] rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-[0_0_20px_rgba(0,163,255,0.2)] hover:shadow-[0_0_35px_rgba(0,229,255,0.45)] hover:-translate-y-1.5 overflow-hidden">
      
      {/* ===== التأثيرات الضوئية للحواف والإطار الخارجي ===== */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-[#00a3ff]/20 group-hover:border-[#00e5ff]/60 transition-colors" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00a3ff]/20 rounded-full blur-3xl group-hover:bg-[#00e5ff]/35 transition-all pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#0066ff]/20 rounded-full blur-3xl group-hover:bg-[#00a3ff]/30 transition-all pointer-events-none" />

      {/* ===== 1. الشريط العلوي: تصنيف المنتج، الخصم، والأزرار السريعة ===== */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {product.category && (
            <span className="px-2.5 py-0.5 rounded-md bg-[#00a3ff]/20 border border-[#00a3ff]/50 text-[10px] font-black text-[#00e5ff] uppercase tracking-wider shadow-[0_0_10px_rgba(0,163,255,0.3)]">
              {product.category}
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-md bg-red-500/20 border border-red-500/50 text-[10px] font-black text-red-400 animate-pulse">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* أزرار التفاعل (نظرة سريعة والمفضلة) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setQuickViewProduct(product)}
            className="p-1.5 rounded-lg bg-[#0b1222] border border-[#00a3ff]/30 text-gray-300 hover:text-white hover:border-[#00e5ff] hover:shadow-[0_0_10px_rgba(0,229,255,0.4)] transition-all"
            title="نظرة سريعة"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`p-1.5 rounded-lg border transition-all ${
              isWishlisted
                ? "bg-red-500/20 border-red-500/60 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                : "bg-[#0b1222] border-[#00a3ff]/30 text-gray-300 hover:text-red-400"
            }`}
            title="المفضلة"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* ===== 2. الماركة واسم المنتج (في المنتصف مع وهج نيون أزرق قوي) ===== */}
      <div className="relative z-10 text-center my-2 space-y-1">
        {product.brand && (
          <span className="text-[11px] font-black tracking-widest text-[#00e5ff] uppercase block drop-shadow-[0_0_10px_rgba(0,229,255,0.7)]">
            {product.brand}
          </span>
        )}
        <h3
          onClick={() => setQuickViewProduct(product)}
          className="text-base font-black text-white hover:text-[#00e5ff] cursor-pointer transition-colors leading-tight line-clamp-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
        >
          {product.title}
        </h3>
      </div>

      {/* ===== 3. منطقة صورة المنتج (مع خلفية نيون وشبكة ثلاثية الأبعاد) ===== */}
      <div
        onClick={() => setQuickViewProduct(product)}
        className="relative z-10 w-full aspect-square rounded-xl bg-gradient-to-b from-[#080d1a] to-[#03060d] border border-[#00a3ff]/40 overflow-hidden flex items-center justify-center p-3 cursor-pointer group-hover:border-[#00e5ff] transition-all my-1 shadow-[inset_0_0_20px_rgba(0,163,255,0.2)]"
      >
        {/* خلفية الشبكة المتوهجة خلف الكيبورد */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#00a3ff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
        
        {/* بقعة نيون دائرية خادعة للتوهج خلف الكيبورد تماماً */}
        <div className="absolute w-28 h-28 bg-[#00a3ff]/30 rounded-full blur-2xl group-hover:scale-125 group-hover:bg-[#00e5ff]/45 transition-all duration-500 pointer-events-none" />

        {/* صورة المنتج */}
        <img
          src={product.image}
          alt={product.title}
          className="relative z-10 w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_12px_25px_rgba(0,0,0,0.9)]"
          loading="lazy"
        />

        {/* مؤشر متوفر بالمخزن */}
        <div className="absolute bottom-2 right-2 z-20 px-2 py-0.5 rounded-md bg-[#050814]/90 border border-[#00a3ff]/40 flex items-center gap-1.5 text-[9px] text-emerald-400 font-black backdrop-blur-md shadow-[0_0_10px_rgba(0,0,0,0.5)]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          متوفر
        </div>
      </div>

      {/* ===== 4. التفاصيل والضمان والتسعير ===== */}
      <div className="relative z-10 mt-2 space-y-2">
        {/* الضمان والتقييم */}
        <div className="flex items-center justify-between text-[11px] px-1">
          <div className="flex items-center gap-1 text-[#00e5ff] font-bold drop-shadow-[0_0_5px_rgba(0,229,255,0.4)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ضمان سنة</span>
          </div>
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{product.rating || "5.0"}</span>
          </div>
        </div>

        {/* السعر وزر الإضافة للسلة */}
        <div className="pt-2 border-t border-[#00a3ff]/30 flex items-center justify-between gap-2">
          {/* عرض السعر */}
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-gray-500 line-through font-mono">
                {product.originalPrice} ₪
              </span>
            )}
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black text-white font-mono leading-none tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {product.price}
              </span>
              <span className="text-xs font-bold text-[#00e5ff]">₪</span>
            </div>
          </div>

          {/* زر أضف للسلة برسم سايبربانك مستقبلي */}
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00a3ff] via-[#0080ff] to-[#00e5ff] hover:from-[#00c3ff] hover:to-[#00a3ff] text-black font-black text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,163,255,0.5)] active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>أضف للسلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
