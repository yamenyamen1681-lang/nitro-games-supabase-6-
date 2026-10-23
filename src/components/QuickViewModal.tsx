"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import {
  X,
  ShoppingBag,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  Check,
  MessageCircle,
  Flame,
  Zap,
  Minus,
  Plus,
} from "lucide-react";
import { STORE_CONTACT } from "@/lib/data";

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist, setIsCartOpen } = useCart() as any;
  const [quantity, setQuantity] = useState(1);

  const productId = quickViewProduct?.id;

  // رجّع الكمية لـ1 كل ما يتغيّر المنتج
  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  // إغلاق بـEscape + قفل سكرول الصفحة خلف النافذة
  useEffect(() => {
    if (!quickViewProduct) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQuickViewProduct(null);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [quickViewProduct, setQuickViewProduct]);

  if (!quickViewProduct) return null;

  const pr = quickViewProduct;
  const isWishlisted = wishlist.some((w: any) =>
    typeof w === "object" && w !== null ? w.id === pr.id : w === pr.id
  );

  const price = Number(pr.price) || 0;
  const orig = Number(pr.originalPrice) || 0;
  const hasDiscount = orig > price && price > 0;
  const pct = hasDiscount ? Math.round((1 - price / orig) * 100) : Number(pr.discountPercent) || 0;
  const rating = Number(pr.rating) || 5;
  const total = price * quantity;

  const handleAddToCart = () => {
    addToCart(pr, quantity);
    setQuickViewProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(pr, quantity);
    setQuickViewProduct(null);
    setIsCartOpen?.(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#02050d]/85 backdrop-blur-md sm:p-4"
      onClick={() => setQuickViewProduct(null)}
    >
      <style>{`
        @property --qvA { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        @keyframes qvSpin { to { --qvA: 360deg; } }
        .qv-frame {
          background: conic-gradient(from var(--qvA), #00e5ff, #0047ff 25%, #04101f 45%, #00a3ff 65%, #00e5ff 85%, #00e5ff);
          animation: qvSpin 8s linear infinite;
        }
        @keyframes qvIn { from { opacity: 0; transform: translate3d(0, 28px, 0) scale(.97); } to { opacity: 1; transform: translate3d(0,0,0) scale(1); } }
        .qv-in { animation: qvIn .4s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes qvFloat { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-8px,0); } }
        .qv-float { animation: qvFloat 4.5s ease-in-out infinite; }
        @keyframes qvSheen { 0%, 55% { left: -60%; } 100% { left: 130%; } }
        .qv-sheen { position: relative; overflow: hidden; }
        .qv-sheen::after {
          content: ""; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent);
          transform: skewX(-20deg); animation: qvSheen 3.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) { .qv-frame, .qv-in, .qv-float, .qv-sheen::after { animation: none !important; } }
      `}</style>

      <div
        className="qv-in relative w-full max-w-3xl max-h-[94vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="pointer-events-none absolute -inset-1 rounded-[30px] bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] opacity-25 blur-xl" />

          <div className="qv-frame relative rounded-t-3xl sm:rounded-3xl p-[2px]">
            <div className="relative overflow-hidden rounded-t-[22px] sm:rounded-[22px] bg-gradient-to-b from-[#0a1630] via-[#071125] to-[#050b19]">
              <div className="pointer-events-none absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />

              {/* إغلاق */}
              <button
                onClick={() => setQuickViewProduct(null)}
                aria-label="إغلاق"
                className="absolute top-4 left-4 z-30 cursor-pointer rounded-xl border border-white/10 bg-black/55 p-2.5 text-gray-300 backdrop-blur-md transition-all hover:border-[#00e5ff] hover:text-[#00e5ff] hover:shadow-[0_0_14px_rgba(0,229,255,0.4)]"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* ===== منصة الصورة ===== */}
                <div className="relative min-h-[270px] md:min-h-full overflow-hidden border-b md:border-b-0 md:border-l border-[#16294a]">
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 65% at 50% 45%, rgba(0,163,255,0.32), transparent 72%), linear-gradient(to bottom, #07122a, #040a16)",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: "radial-gradient(rgba(0,229,255,0.55) 1px, transparent 1px)",
                      backgroundSize: "14px 14px",
                    }}
                  />
                  <div
                    className="absolute bottom-6 left-1/2 h-6 w-3/5 -translate-x-1/2"
                    style={{ background: "radial-gradient(ellipse at center, rgba(0,229,255,0.45), transparent 70%)" }}
                  />

                  <div className="qv-float absolute inset-0 p-8">
                    <div className="relative h-full w-full">
                      <Image
                        src={pr.image}
                        alt={pr.title}
                        fill
                        sizes="(max-width: 768px) 90vw, 400px"
                        className="object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,0.65)]"
                      />
                    </div>
                  </div>

                  {pct > 0 && (
                    <span className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full border border-white/30 bg-gradient-to-r from-[#0047ff] to-[#00e5ff] px-3 py-1.5 text-xs font-black text-white shadow-[0_0_16px_rgba(0,229,255,0.6)]">
                      <Flame className="h-3.5 w-3.5" />
                      خصم {pct}%
                    </span>
                  )}
                </div>

                {/* ===== التفاصيل ===== */}
                <div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                      <span className="font-tech font-bold uppercase tracking-[0.2em] text-[#00a3ff]">{pr.brand}</span>
                      <span className="rounded-lg border border-[#00e5ff]/40 bg-[#061124]/85 px-2.5 py-1 font-tech text-[10px] font-bold uppercase tracking-widest text-[#00e5ff]">
                        {String(pr.category || "").toUpperCase()}
                      </span>
                    </div>

                    <h2 className="bg-gradient-to-b from-white to-[#bfeeff] bg-clip-text font-['Cairo'] text-xl font-black leading-snug text-transparent sm:text-2xl">
                      {pr.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-lg border border-[#16294a] bg-[#0a1630] px-2.5 py-1">
                        <span className="flex gap-0.5">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < Math.round(rating)
                                  ? "fill-[#00e5ff] text-[#00e5ff] drop-shadow-[0_0_5px_#00e5ff]"
                                  : "text-[#1d3563]"
                              }`}
                            />
                          ))}
                        </span>
                        <span className="font-mono text-xs font-black text-white">{rating.toFixed(1)}</span>
                      </span>
                      <span className="text-[11px] text-gray-500">({pr.reviewCount ?? 0} تقييم موثق)</span>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-gray-300">{pr.description}</p>

                    {pr.specs && pr.specs.length > 0 && (
                      <div className="mt-4 space-y-2 rounded-2xl border border-[#16294a] bg-[#060e1f]/80 p-3.5">
                        <div className="font-['Cairo'] text-[11px] font-black text-[#00e5ff]">المواصفات الفنية</div>
                        {pr.specs.slice(0, 4).map((sp: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-200">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00a3ff]/15 border border-[#00a3ff]/40">
                              <Check className="h-2.5 w-2.5 text-[#00e5ff]" />
                            </span>
                            <span className="truncate">{sp}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-200 font-['Cairo']">
                      <div className="flex items-center gap-2 rounded-xl border border-[#00a3ff]/30 bg-[#00a3ff]/10 p-2.5">
                        <ShieldCheck className="h-4 w-4 text-[#00e5ff]" />
                        <span>ضمان سنة كاملة</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-[#00a3ff]/30 bg-[#00a3ff]/10 p-2.5">
                        <Truck className="h-4 w-4 text-[#00e5ff]" />
                        <span>دفع عند الاستلام</span>
                      </div>
                    </div>
                  </div>

                  {/* السعر والشراء */}
                  <div className="space-y-3 border-t border-[#16294a] pt-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        {hasDiscount && (
                          <div className="font-mono text-xs text-gray-500 line-through">{orig.toLocaleString()} ₪</div>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="bg-gradient-to-r from-white to-[#00e5ff] bg-clip-text font-tech text-3xl font-black text-transparent drop-shadow-[0_0_12px_rgba(0,229,255,0.45)]">
                            {total.toLocaleString()}
                          </span>
                          <span className="text-base font-black text-[#00a3ff]">₪</span>
                        </div>
                        {quantity > 1 && (
                          <div className="font-mono text-[10px] text-gray-500">
                            {price.toLocaleString()} ₪ × {quantity}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 rounded-2xl border border-[#1d3563] bg-[#081226] p-1">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          aria-label="إنقاص"
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-gray-300 transition-colors hover:bg-[#00a3ff]/20 hover:text-[#00e5ff]"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-7 text-center font-tech text-base font-black text-white">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          aria-label="زيادة"
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-gray-300 transition-colors hover:bg-[#00a3ff]/20 hover:text-[#00e5ff]"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleBuyNow}
                        className="qv-sheen flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] py-3.5 font-['Cairo'] text-sm font-black text-[#02121f] shadow-[0_0_22px_rgba(0,163,255,0.55)] transition-all hover:shadow-[0_0_34px_rgba(0,229,255,0.85)] active:scale-[0.98]"
                      >
                        <Zap className="h-4 w-4 fill-[#02121f]" />
                        <span>اشتري الآن</span>
                      </button>

                      <button
                        onClick={handleAddToCart}
                        aria-label="أضف إلى السلة"
                        title="أضف إلى السلة"
                        className="cursor-pointer rounded-2xl border border-[#00a3ff]/50 bg-[#0a1a38] p-3.5 text-[#00e5ff] transition-all hover:border-[#00e5ff] hover:shadow-[0_0_16px_rgba(0,229,255,0.4)] active:scale-95"
                      >
                        <ShoppingBag className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => toggleWishlist(pr.id)}
                        aria-label="المفضلة"
                        title="المفضلة"
                        className={`cursor-pointer rounded-2xl border p-3.5 transition-all active:scale-95 ${
                          isWishlisted
                            ? "border-[#00e5ff] bg-[#00e5ff]/15 text-[#00e5ff] shadow-[0_0_14px_#00e5ff]"
                            : "border-[#1d3563] bg-[#081226] text-gray-300 hover:border-[#00a3ff] hover:text-[#00e5ff]"
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-[#00e5ff]" : ""}`} />
                      </button>
                    </div>

                    <a
                      href={`https://wa.me/${STORE_CONTACT.whatsapp}?text=${encodeURIComponent(
                        `مرحباً NITRO GAMES 🎮 أود الاستفسار والطلب المباشر لهذا المنتج:\n\n*${pr.title}*\nالسعر: ${pr.price} ₪\nالكمية: ${quantity}\nمع كفالة سنة وتوصيل سريع.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 font-['Cairo'] text-xs font-black text-black shadow-[0_0_18px_rgba(37,211,102,0.35)] transition-all hover:bg-[#20bd5a]"
                    >
                      <MessageCircle className="h-4 w-4 fill-current" />
                      <span>طلب مباشر وسريع عبر الواتساب: {STORE_CONTACT.short}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
