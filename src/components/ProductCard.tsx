"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Eye, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();

  return (
    <div className="relative group">
      {/* توهج نيون خلفي يظهر عند تمرير الماوس */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] rounded-2xl blur-md opacity-0 group-hover:opacity-75 transition duration-500 pointer-events-none" />

      <div className="relative bg-[#060c18] border border-[#16223a] group-hover:border-[#00e5ff]/60 rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        
        {/* صورة المنتج مع حاوية تفاعلية */}
        <div className="relative h-48 sm:h-56 w-full bg-[#03060f] p-4 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
          
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]"
          />

          {/* شارة التخفيض أو الحالة إن وجدت */}
          {product.originalPrice && (
            <span className="absolute top-3 right-3 bg-[#00a3ff]/20 border border-[#00a3ff]/50 text-[#00e5ff] text-[10px] font-black font-tech px-2.5 py-1 rounded-full shadow-[0_0_10px_rgba(0,163,255,0.3)]">
              تخفيض
            </span>
          )}

          {/* زر معايـنة سريعة عند الـ Hover */}
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="absolute inset-x-4 bottom-3 bg-[#040814]/90 backdrop-blur-md border border-[#00a3ff]/40 hover:border-[#00e5ff] text-[#00e5ff] py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>معاينة سريعة</span>
            </button>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div className="p-4 flex flex-col flex-grow justify-between space-y-3 text-right">
          <div>
            <div className="text-[10px] font-tech text-[#00a3ff] uppercase tracking-wider mb-1">
              {product.brand}
            </div>
            <h3 className="text-sm font-bold text-white line-clamp-2 font-['Cairo'] group-hover:text-[#00e5ff] transition-colors">
              {product.title}
            </h3>
          </div>

          {/* الأسعار وأزرار الإضافة للسلة */}
          <div className="pt-2 border-t border-[#121f38] flex items-center justify-between gap-2">
            <div className="flex flex-col">
              {product.originalPrice && (
                <span className="text-[11px] font-mono text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()} ₪
                </span>
              )}
              <span className="text-base font-black font-mono text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
                {product.price.toLocaleString()} ₪
              </span>
            </div>

            <button
              onClick={() => addToCart(product, 1)}
              className="relative overflow-hidden flex items-center gap-1.5 cursor-pointer rounded-xl text-xs font-black px-3.5 py-2 text-[#02121f] bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.8)] hover:scale-105 transition-all duration-300"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>أضف للسلة</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
