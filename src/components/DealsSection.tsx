"use client";

import React, { useState, useEffect } from "react";
import { Timer, Zap, Heart, Eye, ShoppingCart, CheckCircle, Sparkles, Flame } from "lucide-react";
import { Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";

interface DealsSectionProps {
  dealProducts?: Product[] | any[];
  products?: Product[] | any[];
  /** تاريخ انتهاء العرض الحقيقي. إذا كان فاضي أو انتهى، العدّاد بيعدّ لنهاية اليوم الحالي (عرض يومي). */
  targetDate?: string;
  onQuickView?: (product: any) => void;
}

const CYCLE_MS = 4000;

/* ============ العدّاد التنازلي ============ */
const resolveTarget = (targetDate?: string) => {
  const t = targetDate ? new Date(targetDate).getTime() : NaN;
  if (!isNaN(t) && t > Date.now()) return t;
  const d = new Date();
  d.setHours(24, 0, 0, 0); // نهاية اليوم
  return d.getTime();
};

const DealCountdown = ({ targetDate }: { targetDate?: string }) => {
  const [left, setLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, resolveTarget(targetDate) - Date.now());
      setLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const segs = [
    ...(left && left.d > 0 ? [{ v: left.d, label: "يوم" }] : []),
    { v: left?.h ?? 0, label: "ساعة" },
    { v: left?.m ?? 0, label: "دقيقة" },
    { v: left?.s ?? 0, label: "ثانية", live: true },
  ];

  return (
    <div className="w-full mb-5">
      <div className="dl-frame p-[1.5px] rounded-3xl shadow-[0_0_34px_rgba(0,163,255,0.3)]">
        <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-b from-[#08142b] to-[#040a17] px-4 pt-4 pb-3">
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />

          <div className="flex items-center justify-center gap-2.5 mb-4">
            <Zap className="w-4 h-4 text-[#00e5ff] fill-[#00a3ff]/40" />
            <span className="text-[13px] font-black text-white tracking-wide font-['Cairo']">
              ينتهي العرض الخاص خلال
            </span>
            <Timer className="w-4 h-4 text-[#00e5ff]" />
          </div>

          <div className="flex items-start justify-center gap-1.5 sm:gap-2" dir="ltr">
            {segs.map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && (
                  <span className="dl-blink text-2xl font-black text-[#00a3ff] mt-3 select-none">:</span>
                )}
                <div className="flex flex-col items-center flex-1 max-w-[92px]">
                  <div
                    className={`relative w-full py-3 rounded-2xl bg-gradient-to-b from-[#0d2147] via-[#071229] to-[#040a17] border shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0_16px_rgba(0,163,255,0.25)] ${
                      s.live ? "border-[#00e5ff] shadow-[0_0_20px_rgba(0,229,255,0.45)]" : "border-[#00a3ff]/45"
                    }`}
                  >
                    <span className="block text-center text-3xl sm:text-4xl font-black font-tech tabular-nums bg-gradient-to-b from-white to-[#00e5ff] bg-clip-text text-transparent drop-shadow-[0_0_14px_rgba(0,229,255,0.55)]">
                      {String(s.v).padStart(2, "0")}
                    </span>
                    <span className="pointer-events-none absolute inset-x-2 top-1/2 h-px bg-black/60" />
                  </div>
                  <span className={`text-[11px] font-bold mt-1.5 font-['Cairo'] ${s.live ? "text-[#00e5ff]" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============ قسم العروض ============ */
export const DealsSection: React.FC<DealsSectionProps> = ({
  dealProducts = [],
  products = [],
  targetDate,
  onQuickView,
}) => {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const [slide, setSlide] = useState(0);
  const itemsList = dealProducts.length > 0 ? dealProducts : products;

  useEffect(() => {
    if (itemsList.length <= 1) return;
    const id = setInterval(() => setSlide((p) => (p + 1) % itemsList.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [itemsList.length]);

  useEffect(() => {
    if (slide >= itemsList.length) setSlide(0);
  }, [itemsList.length, slide]);

  const currentItem: any = itemsList[slide] || {};
  const itemTitle = currentItem.title || currentItem.name || "منتج مميز";
  const imageUrl = currentItem.image_url || currentItem.image || currentItem.images?.[0] || "/keyboard.png";

  const price = Number(currentItem.price) || 0;
  const orig = Number(currentItem.originalPrice ?? currentItem.original_price) || 0;
  const hasDiscount = orig > price && price > 0;
  const pct = hasDiscount ? Math.round((1 - price / orig) * 100) : Number(currentItem.discount) || 0;
  const saved = hasDiscount ? orig - price : 0;

  const isWishlisted = wishlist.some((w: any) =>
    typeof w === "object" && w !== null ? w.id === currentItem.id : w === currentItem.id
  );

  return (
    <section className="w-full max-w-lg mx-auto px-4 py-6 text-white" dir="rtl">
      <style>{`
        @property --dlA { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
        @keyframes dlSpin { to { --dlA: 360deg; } }
        .dl-frame {
          background: conic-gradient(from var(--dlA), #00e5ff, #0047ff 25%, #04101f 45%, #00a3ff 65%, #00e5ff 85%, #00e5ff);
          animation: dlSpin 7s linear infinite;
        }
        @keyframes dlFloat { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(0,-9px,0); } }
        .dl-float { animation: dlFloat 4.5s ease-in-out infinite; }
        @keyframes dlBar { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .dl-bar { transform-origin: right; animation: dlBar ${CYCLE_MS}ms linear forwards; }
        @keyframes dlBlink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .dl-blink { animation: dlBlink 1s steps(2, jump-none) infinite; }
        @keyframes dlSheen { 0%, 55% { left: -60%; } 100% { left: 130%; } }
        .dl-sheen { position: relative; overflow: hidden; }
        .dl-sheen::after {
          content: ""; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.55), transparent);
          transform: skewX(-20deg); animation: dlSheen 3.6s ease-in-out infinite;
        }
        @keyframes dlIn { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
        .dl-in { animation: dlIn .5s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .dl-frame, .dl-float, .dl-bar, .dl-blink, .dl-sheen::after, .dl-in { animation: none !important; }
        }
      `}</style>

      <DealCountdown targetDate={targetDate} />

      {/* الكرت الرئيسي */}
      <div className="relative">
        <div className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] opacity-25 blur-lg" />

        <div className="dl-frame relative p-[2px] rounded-3xl">
          <div className="relative rounded-[22px] bg-gradient-to-b from-[#0a1630] via-[#071125] to-[#050b19] p-4 overflow-hidden">
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />

            {/* الشريط العلوي */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#07142e] to-[#0a1d40] border border-[#00e5ff]/40 px-3.5 py-1.5 rounded-full shadow-[0_0_16px_rgba(0,229,255,0.25)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-70" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5ff]" />
                </span>
                <span className="text-[11px] font-black tracking-[0.2em] text-white font-tech uppercase">
                  SPECIAL OFFER
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => currentItem.id != null && toggleWishlist(currentItem.id)}
                  aria-label="المفضلة"
                  className={`p-2.5 rounded-xl border transition cursor-pointer ${
                    isWishlisted
                      ? "bg-[#00e5ff]/15 border-[#00e5ff] text-[#00e5ff] shadow-[0_0_12px_#00e5ff]"
                      : "bg-[#0d1d3a] border-[#1a3363] text-gray-300 hover:text-[#00e5ff] hover:border-[#00a3ff]"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#00e5ff]" : ""}`} />
                </button>
                <button
                  onClick={() => onQuickView?.(currentItem)}
                  aria-label="معاينة سريعة"
                  className="p-2.5 rounded-xl border bg-[#0d1d3a] border-[#1a3363] text-gray-300 hover:text-[#00e5ff] hover:border-[#00a3ff] transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* منصة المنتج */}
            <div className="relative h-60 w-full flex items-center justify-center rounded-2xl border border-[#16294a] overflow-hidden bg-[#040913]">
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,163,255,0.28), transparent 70%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(rgba(0,229,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />

              {/* شارة رقم الشريحة */}
              <div className="absolute top-3 left-3 z-20 bg-black/60 border border-white/15 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg font-mono">
                {slide + 1} / {itemsList.length || 1}
              </div>

              {/* شارة الخصم (أزرق) */}
              {pct > 0 && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-gradient-to-r from-[#0047ff] to-[#00e5ff] text-white font-black text-xs px-3 py-1.5 rounded-full shadow-[0_0_16px_rgba(0,229,255,0.6)] border border-white/30">
                  <Flame className="w-3.5 h-3.5" />
                  <span>خصم {pct}%</span>
                </div>
              )}

              {/* انعكاس أرضية */}
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 w-3/5 h-5 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(0,229,255,0.45), transparent 70%)" }}
              />

              <div key={slide} className="dl-in relative z-10 w-full h-full flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={itemTitle}
                  className="dl-float max-h-48 max-w-[92%] object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.7)]"
                />
              </div>

              {/* شريط تقدم التنقل التلقائي */}
              {itemsList.length > 1 && (
                <div className="absolute bottom-0 inset-x-0 h-[3px] bg-white/5 z-20">
                  <div key={slide} className="dl-bar h-full bg-gradient-to-l from-[#0047ff] to-[#00e5ff] shadow-[0_0_10px_#00e5ff]" />
                </div>
              )}
            </div>

            {/* الماركة والحالة */}
            <div className="flex justify-between items-center mt-4 mb-2">
              <span className="bg-[#0f2347] border border-[#1d3d7a] text-gray-300 px-3 py-1 rounded-lg font-tech tracking-widest text-[10px]">
                {currentItem.brand || "NITRO GAMES"}
              </span>
              <span className="text-[#00e5ff] flex items-center gap-1 bg-[#00e5ff]/10 border border-[#00e5ff]/30 px-2.5 py-1 rounded-lg text-[10px] font-bold">
                <CheckCircle className="w-3 h-3" /> متوفر حالياً
              </span>
            </div>

            {/* العنوان */}
            <h3 className="flex items-center gap-2 text-xl sm:text-2xl font-black font-['Cairo'] leading-snug bg-gradient-to-b from-white to-[#bfeeff] bg-clip-text text-transparent">
              <Sparkles className="w-4 h-4 shrink-0 text-[#00e5ff]" />
              {itemTitle}
            </h3>

            {/* السعر */}
            <div className="mt-4 flex items-end justify-between gap-3 rounded-2xl border border-[#16294a] bg-[#060e1f]/80 px-4 py-3">
              <div>
                {hasDiscount && (
                  <div className="text-xs text-gray-500 line-through font-mono">{orig.toLocaleString()} ₪</div>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black font-tech bg-gradient-to-r from-white to-[#00e5ff] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,229,255,0.45)]">
                    {price ? price.toLocaleString() : "—"}
                  </span>
                  <span className="text-base font-black text-[#00a3ff]">₪</span>
                </div>
              </div>
              {saved > 0 && (
                <span className="text-[11px] font-black text-[#00e5ff] bg-[#00e5ff]/10 border border-[#00e5ff]/35 rounded-lg px-2.5 py-1.5 font-['Cairo']">
                  وفّرت {saved.toLocaleString()} ₪
                </span>
              )}
            </div>

            {/* زر الإضافة */}
            <button
              onClick={() => currentItem.id != null && addToCart(currentItem as Product)}
              className="dl-sheen mt-4 w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#0047ff] via-[#00a3ff] to-[#00e5ff] text-[#02121f] text-sm font-black px-5 py-3.5 rounded-2xl shadow-[0_0_24px_rgba(0,163,255,0.55)] hover:shadow-[0_0_34px_rgba(0,229,255,0.85)] transition-all duration-300 active:scale-[0.98] cursor-pointer font-['Cairo']"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>إضافة للسلة</span>
            </button>

            {/* نقاط المؤشر */}
            {itemsList.length > 1 && (
              <div className="flex items-center justify-center gap-2 pt-5">
                {itemsList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlide(idx)}
                    aria-label={`عرض ${idx + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      slide === idx
                        ? "w-8 bg-gradient-to-r from-[#00a3ff] to-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.8)]"
                        : "w-2.5 bg-[#122347] hover:bg-[#00a3ff]/50 border border-[#1d3563]"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
