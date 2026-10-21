"use client";

import React from "react";

/*
 * خلفية خفيفة على الـGPU (نسخة ثانية).
 * النسخة السابقة كانت تسبب وميض وبلوكات سوداء وطبقات تختفي على موبايل كروم
 * بسبب: blur كبير جداً على عناصر ضخمة، mix-blend-mode، تحريك background-position
 * (إعادة رسم كل فريم)، وفلاتر drop-shadow على أشكال متحركة.
 * هون كل شي بدون أي filter / blend / backdrop، والحركة كلها transform فقط،
 * والعناصر الثقيلة مخفية على الموبايل.
 */

const PARTICLES: Array<[number, number, number, number]> = [
  // [left %, size px, duration s, delay s]
  [6, 3, 26, 0], [18, 3, 30, 8], [31, 3, 24, 4], [44, 3, 32, 12],
  [57, 3, 28, 2], [70, 3, 25, 10], [83, 3, 31, 6], [94, 3, 27, 14],
];

const SHAPES: Array<{
  kind: "hex" | "ring" | "diamond" | "plus" | "tri";
  left: string;
  top: string;
  size: number;
  dur: number;
  delay: number;
  color: string;
  mobile: boolean;
}> = [
  { kind: "hex", left: "6%", top: "14%", size: 90, dur: 18, delay: 0, color: "#00e5ff", mobile: true },
  { kind: "ring", left: "86%", top: "22%", size: 110, dur: 24, delay: 3, color: "#00a3ff", mobile: true },
  { kind: "diamond", left: "78%", top: "62%", size: 64, dur: 20, delay: 5, color: "#00e5ff", mobile: false },
  { kind: "plus", left: "14%", top: "58%", size: 40, dur: 16, delay: 2, color: "#00a3ff", mobile: false },
  { kind: "tri", left: "46%", top: "10%", size: 56, dur: 22, delay: 7, color: "#4d8bff", mobile: false },
  { kind: "hex", left: "90%", top: "84%", size: 60, dur: 26, delay: 4, color: "#00a3ff", mobile: false },
  { kind: "ring", left: "3%", top: "86%", size: 76, dur: 21, delay: 9, color: "#00e5ff", mobile: false },
];

const Shape: React.FC<{ kind: string; color: string }> = ({ kind, color }) => {
  const p = { fill: "none", stroke: color, strokeWidth: 1.4 };
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {kind === "hex" && <polygon points="50,4 93,27 93,73 50,96 7,73 7,27" {...p} />}
      {kind === "ring" && (
        <>
          <circle cx="50" cy="50" r="44" {...p} />
          <circle cx="50" cy="50" r="30" {...p} strokeDasharray="3 6" />
        </>
      )}
      {kind === "diamond" && <polygon points="50,5 95,50 50,95 5,50" {...p} />}
      {kind === "plus" && <path d="M50 8 V92 M8 50 H92" {...p} strokeLinecap="round" />}
      {kind === "tri" && <polygon points="50,8 94,88 6,88" {...p} />}
    </svg>
  );
};

export const CyberBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden select-none"
      style={{ background: "linear-gradient(180deg, #02040a 0%, #040916 45%, #030712 100%)" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes nbDrift1 { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(60px,-40px,0); } }
        @keyframes nbDrift2 { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(-50px,50px,0); } }
        @keyframes nbDrift3 { 0%,100% { transform: translate3d(0,0,0); } 50% { transform: translate3d(30px,35px,0); } }
        @keyframes nbFloat { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(0,-22px,0) rotate(16deg); } }
        @keyframes nbRise { from { transform: translate3d(0,0,0); opacity: 0; } 10% { opacity: .8; } 90% { opacity: .8; } to { transform: translate3d(0,-105vh,0); opacity: 0; } }
        @keyframes nbFloorMove { from { transform: translate3d(0,0,0); } to { transform: translate3d(0,60px,0); } }
        .nb-b1 { animation: nbDrift1 24s ease-in-out infinite; will-change: transform; }
        .nb-b2 { animation: nbDrift2 28s ease-in-out infinite; will-change: transform; }
        .nb-b3 { animation: nbDrift3 26s ease-in-out infinite; will-change: transform; }
        .nb-shape { animation: nbFloat var(--d) ease-in-out infinite; animation-delay: var(--dl); will-change: transform; }
        .nb-particle { animation: nbRise var(--d) linear infinite; animation-delay: var(--dl); will-change: transform, opacity; }
        .nb-floor-inner { animation: nbFloorMove 3.4s linear infinite; will-change: transform; }
        @media (prefers-reduced-motion: reduce) {
          .nb-b1,.nb-b2,.nb-b3,.nb-shape,.nb-particle,.nb-floor-inner { animation: none !important; }
        }
        /* على الموبايل: بدون حركة للهالات (توفير GPU) */
        @media (max-width: 767px) {
          .nb-b1,.nb-b2,.nb-b3 { animation: none !important; }
        }
      `}</style>

      {/* هالات زرقاء: تدرّج شعاعي بدل blur (أخف بكثير على الـGPU) */}
      <div
        className="nb-b1 absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,229,255,0.16) 0%, rgba(0,229,255,0) 65%)" }}
      />
      <div
        className="nb-b2 absolute top-1/4 -right-56 w-[760px] h-[760px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,71,255,0.22) 0%, rgba(0,71,255,0) 65%)" }}
      />
      <div
        className="nb-b3 absolute -bottom-56 left-1/4 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(0,163,255,0.16) 0%, rgba(0,163,255,0) 65%)" }}
      />

      {/* أشعة ضوء قطرية (تدرّج فقط، بدون blur) — ديسكتوب بس */}
      <div
        className="hidden md:block absolute -top-1/4 left-[12%] w-[180px] h-[160%] -rotate-[22deg]"
        style={{ background: "linear-gradient(to bottom, rgba(0,229,255,0.09), rgba(0,163,255,0.03) 50%, transparent)" }}
      />
      <div
        className="hidden md:block absolute -top-1/4 left-[58%] w-[240px] h-[160%] rotate-[18deg]"
        style={{ background: "linear-gradient(to bottom, rgba(77,139,255,0.09), rgba(0,71,255,0.03) 50%, transparent)" }}
      />

      {/* شبكة ثابتة خفيفة */}
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,255,0.5) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, #000 30%, transparent 100%)",
        }}
      />

      {/* أرضية شبكة بمنظور 3D — ديسكتوب بس، والحركة transform بدل background-position */}
      <div
        className="hidden md:block absolute inset-x-0 bottom-0 h-[50%] overflow-hidden"
        style={{
          maskImage: "linear-gradient(to top, #000 0%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 85%)",
        }}
      >
        <div
          className="absolute left-[-40%] right-[-40%] bottom-0 h-[150%] origin-bottom overflow-hidden opacity-[0.26]"
          style={{ transform: "perspective(500px) rotateX(62deg)" }}
        >
          <div
            className="nb-floor-inner absolute left-0 right-0 -top-[60px] bottom-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,163,255,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,255,0.8) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
      </div>

      {/* أشكال هندسية عائمة (بدون filter) */}
      {SHAPES.map((s, i) => (
        <div
          key={i}
          className={`nb-shape absolute opacity-[0.22] ${s.mobile ? "" : "hidden md:block"}`}
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            ["--d" as never]: `${s.dur}s`,
            ["--dl" as never]: `-${s.delay}s`,
          }}
        >
          <Shape kind={s.kind} color={s.color} />
        </div>
      ))}

      {/* جزيئات ضوئية صاعدة */}
      {PARTICLES.map(([left, size, dur, delay], i) => (
        <span
          key={i}
          className={`nb-particle absolute bottom-[-10px] rounded-full bg-[#00e5ff] ${i > 3 ? "hidden md:block" : ""}`}
          style={{
            left: `${left}%`,
            width: size,
            height: size,
            ["--d" as never]: `${dur}s`,
            ["--dl" as never]: `-${delay}s`,
          }}
        />
      ))}

      {/* فينييت */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#02040a_100%)]" />

      {/* خط أفق نيون أعلى الصفحة */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00e5ff]/50 to-transparent" />
    </div>
  );
};
