"use client";

import React from "react";

/*
 * خلفية التطبيق الفاخرة — طبقات (من الأعمق للأقرب):
 * 1. تدرّج أساسي داكن
 * 2. شفق (aurora) أزرق/سماوي متحرك ببطء
 * 3. أشعة ضوء قطرية ناعمة
 * 4. أرضية شبكة بمنظور 3D تتحرك نحو الشاشة
 * 5. أشكال هندسية عائمة متوهجة
 * 6. جزيئات ضوئية صاعدة
 * 7. حبيبات (grain) خفيفة للعمق + فينييت
 * كل المواقع ثابتة (بدون Math.random) لتجنب أخطاء الـhydration،
 * والحركة كلها CSS (transform/opacity) خفيفة على الموبايل.
 */

const PARTICLES: Array<[number, number, number, number]> = [
  // [left %, size px, duration s, delay s]
  [4, 2, 22, 0], [9, 3, 28, 6], [15, 2, 19, 3], [21, 2, 26, 11], [27, 3, 24, 2],
  [33, 2, 30, 8], [39, 2, 21, 14], [45, 3, 27, 5], [51, 2, 23, 9], [57, 2, 29, 1],
  [63, 3, 20, 12], [69, 2, 25, 7], [75, 2, 31, 4], [81, 3, 22, 10], [87, 2, 26, 13],
  [93, 2, 24, 3], [12, 2, 33, 16], [48, 2, 18, 15], [72, 3, 28, 17], [96, 2, 21, 8],
];

const SHAPES: Array<{
  kind: "hex" | "ring" | "diamond" | "plus" | "tri";
  left: string;
  top: string;
  size: number;
  dur: number;
  delay: number;
  color: string;
}> = [
  { kind: "hex", left: "6%", top: "14%", size: 90, dur: 18, delay: 0, color: "#00e5ff" },
  { kind: "ring", left: "88%", top: "22%", size: 120, dur: 24, delay: 3, color: "#00a3ff" },
  { kind: "diamond", left: "78%", top: "62%", size: 70, dur: 20, delay: 5, color: "#00e5ff" },
  { kind: "plus", left: "14%", top: "58%", size: 44, dur: 16, delay: 2, color: "#00a3ff" },
  { kind: "tri", left: "46%", top: "10%", size: 60, dur: 22, delay: 7, color: "#4d8bff" },
  { kind: "hex", left: "92%", top: "84%", size: 64, dur: 26, delay: 4, color: "#00a3ff" },
  { kind: "ring", left: "3%", top: "86%", size: 80, dur: 21, delay: 9, color: "#00e5ff" },
  { kind: "diamond", left: "34%", top: "74%", size: 46, dur: 19, delay: 1, color: "#4d8bff" },
];

const Shape: React.FC<{ kind: string; color: string }> = ({ kind, color }) => {
  const common = { fill: "none", stroke: color, strokeWidth: 1.2 };
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
      {kind === "hex" && <polygon points="50,4 93,27 93,73 50,96 7,73 7,27" {...common} />}
      {kind === "ring" && (
        <>
          <circle cx="50" cy="50" r="44" {...common} />
          <circle cx="50" cy="50" r="30" {...common} strokeDasharray="3 6" />
        </>
      )}
      {kind === "diamond" && <polygon points="50,5 95,50 50,95 5,50" {...common} />}
      {kind === "plus" && <path d="M50 8 V92 M8 50 H92" {...common} strokeLinecap="round" />}
      {kind === "tri" && <polygon points="50,8 94,88 6,88" {...common} />}
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
        @keyframes nbDrift1 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(80px,-50px,0) scale(1.15); } }
        @keyframes nbDrift2 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-70px,60px,0) scale(1.1); } }
        @keyframes nbDrift3 { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(40px,45px,0) scale(1.12); } }
        @keyframes nbBeam { 0%,100% { opacity: 0.35; transform: rotate(var(--r)) translateX(0); } 50% { opacity: 0.75; transform: rotate(calc(var(--r) + 4deg)) translateX(40px); } }
        @keyframes nbGrid { from { background-position: 0 0; } to { background-position: 0 60px; } }
        @keyframes nbFloat { 0%,100% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(0,-26px,0) rotate(18deg); } }
        @keyframes nbRise { from { transform: translateY(0); opacity: 0; } 10% { opacity: 0.9; } 90% { opacity: 0.9; } to { transform: translateY(-110vh); opacity: 0; } }
        .nb-b1 { animation: nbDrift1 22s ease-in-out infinite; }
        .nb-b2 { animation: nbDrift2 26s ease-in-out infinite; }
        .nb-b3 { animation: nbDrift3 24s ease-in-out infinite; }
        .nb-beam { animation: nbBeam 14s ease-in-out infinite; }
        .nb-floor { animation: nbGrid 3.2s linear infinite; }
        .nb-shape { animation: nbFloat var(--d) ease-in-out infinite; animation-delay: var(--dl); }
        .nb-particle { animation: nbRise var(--d) linear infinite; animation-delay: var(--dl); }
        @media (prefers-reduced-motion: reduce) {
          .nb-b1,.nb-b2,.nb-b3,.nb-beam,.nb-floor,.nb-shape,.nb-particle { animation: none !important; }
        }
      `}</style>

      {/* 2. شفق أزرق متحرك */}
      <div className="nb-b1 absolute -top-40 -left-40 w-[680px] h-[680px] rounded-full bg-[#00e5ff]/[0.15] blur-[150px]" />
      <div className="nb-b2 absolute top-1/4 -right-48 w-[720px] h-[720px] rounded-full bg-[#0047ff]/[0.20] blur-[170px]" />
      <div className="nb-b3 absolute -bottom-48 left-1/4 w-[680px] h-[680px] rounded-full bg-[#00a3ff]/[0.15] blur-[160px]" />

      {/* 3. أشعة ضوء قطرية */}
      <div
        className="nb-beam absolute -top-1/4 left-[12%] w-[160px] h-[160%] bg-gradient-to-b from-[#00e5ff]/[0.10] via-[#00a3ff]/[0.04] to-transparent blur-2xl"
        style={{ ["--r" as never]: "-22deg" }}
      />
      <div
        className="nb-beam absolute -top-1/4 left-[58%] w-[220px] h-[160%] bg-gradient-to-b from-[#4d8bff]/[0.10] via-[#0047ff]/[0.04] to-transparent blur-3xl"
        style={{ ["--r" as never]: "18deg", animationDelay: "-5s" }}
      />

      {/* شبكة خفيفة بالخلفية العامة */}
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

      {/* 4. أرضية شبكة بمنظور 3D تتحرك نحو الشاشة */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden"
        style={{
          maskImage: "linear-gradient(to top, #000 0%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to top, #000 0%, transparent 85%)",
        }}
      >
        <div
          className="nb-floor absolute left-[-50%] right-[-50%] bottom-0 h-[160%] origin-bottom opacity-[0.28]"
          style={{
            transform: "perspective(500px) rotateX(62deg)",
            backgroundImage:
              "linear-gradient(to right, rgba(0,163,255,0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,255,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* 5. أشكال هندسية عائمة */}
      {SHAPES.map((s, i) => (
        <div
          key={i}
          className="nb-shape absolute opacity-[0.22]"
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

      {/* 6. جزيئات ضوئية صاعدة */}
      {PARTICLES.map(([left, size, dur, delay], i) => (
        <span
          key={i}
          className="nb-particle absolute bottom-[-10px] rounded-full bg-[#00e5ff]"
          style={{
            left: `${left}%`,
            width: size,
            height: size,
            boxShadow: "0 0 8px 2px rgba(0,229,255,0.55)",
            ["--d" as never]: `${dur}s`,
            ["--dl" as never]: `-${delay}s`,
          }}
        />
      ))}

      {/* 7. حبيبات للعمق */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* فينييت لإبراز المحتوى */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#02040a_100%)]" />

      {/* خط أفق نيون أعلى الصفحة */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00e5ff]/50 to-transparent" />
    </div>
  );
};
