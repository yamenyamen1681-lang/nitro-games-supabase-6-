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

    // First appearance
    const first = setTimeout(() => setVisible(true), 3000);

    // Rotate the delivery message every 5s
    const rotator = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 5000);

    // Hide / show cycle
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => setVisible(true), 1200);
    }, 14000);

    return () => {
      clearTimeout(first);
      clearInterval(rotator);
      clearInterval(cycle);
    };
  }, [closedManually, messages.length]);

  if (closedManually || !visible || messages.length === 0) return null;

  const current = messages[index % messages.length];
  const Icon = ICONS[index % ICONS.length];

  return (
    <div className="fixed bottom-5 right-3 sm:right-5 z-40 max-w-[240px] sm:max-w-xs transition-all duration-500">
      <div className="relative p-2.5 pr-2.5 pl-2 rounded-xl bg-[#0b1120] border border-[#00a3ff]/35 shadow-[0_10px_35px_rgba(0,0,0,.85),0_0_20px_rgba(0,163,255,.15)] flex items-center gap-2 text-right">
        {/* Glowing icon */}
        <div className="relative w-8 h-8 rounded-lg bg-[#152034] border border-[#00a3ff]/40 flex items-center justify-center flex-shrink-0 text-[#00a3ff]">
          <Icon className="w-3.5 h-3.5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a3ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a3ff]"></span>
          </span>
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[8px] font-black text-[#02121f] bg-[#00e5ff] px-1.5 py-0.5 rounded-full font-tech">
              NITRO GAMES
            </span>
            <span className="text-[8px] font-bold text-[#00a3ff]">مزايا المتجر</span>
          </div>

          <p
            key={index}
            className="animate-fade-in-down text-[10px] sm:text-[11px] font-bold text-gray-100 leading-snug font-['Cairo'] line-clamp-2"
          >
            {current}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => {
            setVisible(false);
            setClosedManually(true);
          }}
          className="p-0.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors self-start"
          aria-label="إغلاق الإشعار"
          title="إغلاق الإشعار"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
