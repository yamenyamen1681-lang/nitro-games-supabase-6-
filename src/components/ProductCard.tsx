"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Heart, Eye, Star, ShieldCheck, CheckCircle2, Flame } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, wishlist, toggleWishlist, setQuickViewProduct } = useCart();
  const p = product as any;
  // يفتح نافذة المعاينة: من الـprop إذا انمرّرت، وإلا مباشرة من الـCartContext
  const openQuick = () => (onQuickView ? onQuickView(product) : setQuickViewProduct(product));

  const isWishlisted = wishlist.some((item: any) =>
    typeof item === "object" && item !== null ? item.id === product.id : item === product.id
  );

  const price = Number(p.price) || 0;
  const orig = Number(p.originalPrice) || 0;
  const hasDiscount = orig > price && price > 0;
  const pct = hasDiscount
    ? Math.round((1 - price / orig) * 100)
    : Number(p.discountPercent ?? p.discount) || 0;
  const saved = hasDiscount ? orig - price : 0;
  const rating = Number(p.rating) || 5;
  const reviews = Number(p.reviewCount) || 0;
  const inStock = p.inStock !== false && p.stock !== 0;

  return (
    <div className="group relative h-full">
      {/* هالة خلف الكرت عند اللمس */}
      <div className="pointer-events-none absolute -inset-1 rounded-[26px] bg-gradient-to-b from-[#00e5ff] to-[#0047ff] opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-30" />

      {/* إطار متدرّج */}
      <div className="relative h-full rounded-3xl p-[1.5px] bg-gradient-to-b from-[#00a3ff]/55 via-[#13213d] to-[#0a1630] transition-all duration-500 group-hover:from-[#00e5ff] group-hover:via-[#00a3ff]/50 group-hover:to-[#0047ff]/60 group-hover:-translate-y-1.5">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-gradient-to-b from-[#0a1630] via-[#071125] to-[#050b19]">
          {/* خط ضوء علوي */}
          <div className="pointer-events-none absolute inset-x-8 top-0 z-30 h-px bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />

          {/* لمعة زجاجية تعبر عند اللمس */}
          <span className="pointer-events-none absolute inset-y-0 left-0 z-30 w-1/4 -translate-x-full skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[420%]" />

          {/* ===== منصة الصورة ===== */}
          <div
            className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden"
            onClick={openQuick}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 75% 65% at 50% 48%, rgba(0,163,255,0.30), transparent 72%), linear-gradient(to bottom, #07122a, #040a16)",
              }}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "radial-gradient(rgba(0,229,255,0.55) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
              }}
            />

            {/* انعكاس أرضية */}
            <div
              className="absolute bottom-3 left-1/2 h-5 w-3/5 -translate-x-1/2"
              style={{ background: "radial-gradient(ellipse at center, rgba(0,229,255,0.4), transparent 70%)" }}
            />

            <Image
              src={product.image || "/images/placeholder.jpg"}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 25vw"
              className="object-contain p-5 drop-shadow-[0_16px_18px_rgba(0,0,0,0.65)] transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-1"
            />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#071125] to-transparent" />
          </div>

          {/* ===== الشارات والأزرار فوق الصورة ===== */}
          <div className="absolute inset-x-3 top-3 z-20 flex items-start justify-between">
            {/* يمين: التصنيف + الخصم */}
            <div className="flex flex-col items-start gap-1.5">
              <span className="rounded-lg border border-[#00e5ff]/40 bg-[#061124]/85 px-2.5 py-1 font-tech text-[10px] font-bold uppercase tracking-widest text-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                {p.category || "GEAR"}
              </span>
              {pct > 0 && (
                <span className="flex items-center gap-1 rounded-full border border-white/30 bg-gradient-to-r from-[#0047ff] to-[#00e5ff] px-2.5 py-1 text-[11px] font-black text-white shadow-[0_0_14px_rgba(0,229,255,0.55)]">
                  <Flame className="h-3 w-3" />
                  خصم {pct}%
                </span>
              )}
              {p.isNew && (
                <span className="rounded-full bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] px-2.5 py-0.5 font-mono text-[10px] font-black text-[#02121f] shadow-[0_0_10px_#00e5ff]">
                  NEW
                </span>
              )}
            </div>

            {/* يسار: مفضلة + معاينة */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(product.id as any)}
                aria-label="المفضلة"
                className={`cursor-pointer rounded-xl border p-2.5 backdrop-blur-md transition-all ${
                  isWishlisted
                    ? "border-[#00e5ff] bg-[#00e5ff]/20 text-[#00e5ff] shadow-[0_0_12px_#00e5ff]"
                    : "border-white/10 bg-black/45 text-gray-200 hover:border-[#00a3ff] hover:text-[#00e5ff]"
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? "fill-[#00e5ff]" : ""}`} />
              </button>
              {(
                <button
                  onClick={openQuick}
                  aria-label="معاينة سريعة"
                  className="cursor-pointer rounded-xl border border-white/10 bg-black/45 p-2.5 text-gray-200 backdrop-blur-md transition-all hover:border-[#00a3ff] hover:text-[#00e5ff]"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* ===== التفاصيل ===== */}
          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <div className="font-tech text-[11px] font-bold uppercase tracking-[0.2em] text-[#00a3ff]">
              {product.brand}
            </div>

            <h3
              onClick={openQuick}
              className="mt-1 line-clamp-2 min-h-[2.8em] cursor-pointer bg-gradient-to-b from-white to-[#bfeeff] bg-clip-text font-['Cairo'] text-lg font-black leading-snug text-transparent sm:text-xl"
            >
              {product.title}
            </h3>

            {/* التقييم + الضمان + التوفر */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 rounded-lg border border-[#16294a] bg-[#0a1630] px-2 py-1">
                <span className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < Math.round(rating) ? "fill-[#00e5ff] text-[#00e5ff]" : "text-[#1d3563]"}`}
                    />
                  ))}
                </span>
                <span className="font-mono text-[11px] font-bold text-gray-200">{rating.toFixed(1)}</span>
                {reviews > 0 && <span className="font-mono text-[10px] text-gray-500">({reviews})</span>}
              </span>

              <span className="flex items-center gap-1 rounded-lg border border-[#00a3ff]/30 bg-[#00a3ff]/10 px-2 py-1 text-[11px] font-bold text-[#00e5ff] font-['Cairo']">
                <ShieldCheck className="h-3.5 w-3.5" />
                ضمان سنة
              </span>

              <span
                className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-bold font-['Cairo'] ${
                  inStock
                    ? "border-[#00e5ff]/30 bg-[#00e5ff]/10 text-[#00e5ff]"
                    : "border-gray-600/40 bg-gray-700/20 text-gray-400"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {inStock ? "متوفر" : "نفذت الكمية"}
              </span>
            </div>

            {/* السعر والشراء */}
            <div className="mt-auto pt-4">
              <div className="flex items-end justify-between gap-3 rounded-2xl border border-[#16294a] bg-[#060e1f]/80 px-4 py-3">
                <div>
                  {hasDiscount && (
                    <div className="font-mono text-xs text-gray-500 line-through">{orig.toLocaleString()} ₪</div>
                  )}
                  <div className="flex items-baseline gap-1">
                    <span className="bg-gradient-to-r from-white to-[#00e5ff] bg-clip-text font-tech text-2xl font-black text-transparent drop-shadow-[0_0_12px_rgba(0,229,255,0.4)] sm:text-3xl">
                      {price.toLocaleString()}
                    </span>
                    <span className="text-base font-black text-[#00a3ff]">₪</span>
                  </div>
                </div>
                {saved > 0 && (
                  <span className="rounded-lg border border-[#00e5ff]/35 bg-[#00e5ff]/10 px-2.5 py-1.5 font-['Cairo'] text-[11px] font-black text-[#00e5ff]">
                    وفّرت {saved.toLocaleString()} ₪
                  </span>
                )}
              </div>

              <button
                onClick={() => addToCart(product)}
                disabled={!inStock}
                className="relative mt-3 flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] px-5 py-3.5 font-['Cairo'] text-sm font-black text-[#02121f] shadow-[0_0_22px_rgba(0,163,255,0.5)] transition-all duration-300 hover:shadow-[0_0_34px_rgba(0,229,255,0.85)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>أضف للسلة</span>
              </button>
            </div>
          </div>

          {/* خط إضاءة سفلي */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#0047ff] via-[#00e5ff] to-[#0047ff] opacity-0 shadow-[0_0_12px_#00e5ff] transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
};
