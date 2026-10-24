"use client";

import React, { useState, useEffect } from "react";
import { Truck, X, Zap, ShieldCheck, Star, Gift, Mouse, Banknote, Headphones } from "lucide-react";

const DEFAULT_MESSAGES = [
  "عتاد أصلي 100% من الوكلاء المعتمدين",
  "ضمان حقيقي لمدة سنة على كل المنتجات ⭐",
  "سويتشات Rapid Trigger باستجابة 0.1 ملم ⚡",
  "خصم 10% فوري بكود: NITRO10",
  "ماوسات لاسلكية بتردد 8000Hz 🖱️",
  "دفع عند الاستلام — افحص قبل ما تدفع 💵",
  "صوت محيطي 360° مع عزل ANC 🎧",
  "توصيل سريع لكافة مناطق فلسطين والداخل المحتل 🚚",
];

const ICONS = [Star, ShieldCheck, Zap, Gift, Mouse, Banknote, Headphones, Truck];

export const LiveSalesToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [closedManually, setClosedManually] = useState(false);
  const [index, setIndex] = useState(0);
  const [messages, setMessages] = useState<string[]>(DEFAULT_MESSAGES);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings?key=notifications", { cache: "no-store" });
        const data = await res.json();
        if (data.success && Array.isArray(data.value?.messages) && data.value.messages.length > 0) {
          setMessages(data.value.messages);
        }
      } catch (err) {
        console.warn("Failed to load notifications:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (closedManually) return;

    // أول ظهور
    const first = setTimeout(() => setVisible(true), 3000);

    // تغيير الرسالة كل 5 ثواني
    const rotator = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 5000);

    // دورة إخفاء / إظهار
    let showTimer: ReturnType<typeof setTimeout> | undefined;
    const cycle = setInterval(() => {
      setVisible(false);
      showTimer = setTimeout(() => setVisible(true), 1200);
    }, 14000);

    return () => {
      clearTimeout(first);
      clearInterval(rotator);
      clearInterval(cycle);
      if (showTimer) clearTimeout(showTimer);
    };
  }, [closedManually, messages.length]);

  if (closedManually || !visible || messages.length === 0) return null;

  const current = messages[index % messages.length];
  const Icon = ICONS[index % ICONS.length];

  return (
    <div className="fixed bottom-5 right-3 sm:right-5 z-40 w-[250px] sm:w-[300px]">
      <style>{`
        @keyframes lstIn { from { opacity: 0; transform: translate3d(0, 18px, 0) scale(.96); } to { opacity: 1; transform: translate3d(0,0,0) scale(1); } }
        @keyframes lstText { from { opacity: 0; transform: translate3d(0, -6px, 0); } to { opacity: 1; transform: translate3d(0,0,0); } }
        @keyframes lstSheen { 0% { transform: translateX(-130%) skewX(-18deg); } 55%,100% { transform: translateX(520%) skewX(-18deg); } }
        @keyframes lstBar { from { transform: scaleX(1); } to { transform: scaleX(0); } }
        .lst-in { animation: lstIn .5s cubic-bezier(.2,.8,.2,1) both; }
        .lst-text { animation: lstText .4s ease both; }
        .lst-sheen { animation: lstSheen 4.5s ease-in-out infinite; }
        .lst-bar { transform-origin: right center; animation: lstBar 5s linear both; }
        @media (prefers-reduced-motion: reduce) {
          .lst-in, .lst-text, .lst-sheen, .lst-bar { animation: none !important; }
        }
      `}</style>

      <div className="lst-in relative rounded-2xl p-[1.5px] bg-gradient-to-br from-[#00e5ff] via-[#0047ff] to-[#00a3ff] shadow-[0_12px_36px_rgba(0,0,0,.8),0_0_22px_rgba(0,163,255,.35)]">
        <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-b from-[#0a1630] to-[#050b19] px-3 py-2.5 sm:px-3.5 sm:py-3 text-right">
          {/* خط ضوء علوي */}
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent" />

          {/* لمعة تعبر */}
          <span className="lst-sheen pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative flex items-center gap-2.5">
            {/* الأيقونة */}
            <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0047ff] to-[#00a3ff] p-[1.5px] shadow-[0_0_14px_rgba(0,163,255,.55)]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#061124] text-[#00e5ff]">
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00e5ff] opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00e5ff]" />
              </span>
            </div>

            {/* الرسالة */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="rounded-full bg-gradient-to-r from-[#0047ff] to-[#00e5ff] px-2 py-0.5 font-tech text-[8px] font-black tracking-wider text-white">
                  NITRO GAMES
                </span>
                <span className="font-['Cairo'] text-[9px] font-bold text-[#00a3ff]">مزايا المتجر</span>
              </div>
              <p
                key={index}
                className="lst-text line-clamp-2 font-['Cairo'] text-[11px] font-bold leading-snug text-gray-100 sm:text-xs"
              >
                {current}
              </p>
            </div>

            {/* إغلاق */}
            <button
              onClick={() => {
                setVisible(false);
                setClosedManually(true);
              }}
              className="cursor-pointer self-start rounded-lg border border-white/10 bg-white/5 p-1 text-gray-400 transition-colors hover:border-[#00a3ff]/60 hover:text-white"
              aria-label="إغلاق الإشعار"
              title="إغلاق الإشعار"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* شريط الوقت */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#0d1a33]">
            <div
              key={`bar-${index}`}
              className="lst-bar h-full bg-gradient-to-l from-[#0047ff] via-[#00a3ff] to-[#00e5ff]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
