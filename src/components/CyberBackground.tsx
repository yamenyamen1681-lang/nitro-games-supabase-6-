"use client";

import React from "react";

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#030712] select-none">
      <style>{`
        @keyframes bgDrift1 {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(60px, -40px, 0) scale(1.12); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes bgDrift2 {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(-50px, 50px, 0) scale(1.08); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes bgDrift3 {
          0%   { transform: translate3d(0, 0, 0) scale(1); }
          50%  { transform: translate3d(30px, 35px, 0) scale(1.1); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes slowSpinReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.8; }
        }
        .bg-blob-1 { animation: bgDrift1 16s ease-in-out infinite; }
        .bg-blob-2 { animation: bgDrift2 20s ease-in-out infinite; }
        .bg-blob-3 { animation: bgDrift3 18s ease-in-out infinite; }
        .bg-spin-slow { animation: slowSpin 70s linear infinite; }
        .bg-spin-slow-rev { animation: slowSpinReverse 90s linear infinite; }
        .bg-star { animation: twinkle 4s ease-in-out infinite; }
      `}</style>

      {/* 1. هالات نيون زرقاء متحركة (ببطء) — بدّلت البنفسجي/الوردي بدرجات زرقاء
          متناسقة مع هوية الموقع بالكامل */}
      <div
        className="bg-blob-1 absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#00e5ff]/[0.14] rounded-full blur-[140px]"
      />
      <div
        className="bg-blob-2 absolute top-1/3 -right-40 w-[650px] h-[650px] bg-[#0047ff]/[0.16] rounded-full blur-[160px]"
      />
      <div
        className="bg-blob-3 absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-[#00a3ff]/[0.13] rounded-full blur-[150px]"
      />

      {/* 2. خطوط شبكة السايبر */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 229, 255, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 229, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* 3. أشكال زخرفية فاخرة — إطارات هندسية دوّارة خافتة جدًا، لإحساس
          "تقني راقي" بدل الفراغ المسطح، بدون ما تلفت الانتباه عن المحتوى */}
      <svg
        className="bg-spin-slow absolute -top-24 -right-24 w-[420px] h-[420px] opacity-[0.10]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <polygon
          points="100,6 182,53 182,147 100,194 18,147 18,53"
          stroke="#00e5ff"
          strokeWidth="0.6"
        />
        <polygon
          points="100,36 156,68 156,132 100,164 44,132 44,68"
          stroke="#00a3ff"
          strokeWidth="0.6"
        />
        <circle cx="100" cy="100" r="92" stroke="#00e5ff" strokeWidth="0.4" strokeDasharray="2 6" />
      </svg>

      <svg
        className="bg-spin-slow-rev absolute bottom-[-140px] left-[-120px] w-[480px] h-[480px] opacity-[0.08]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="96" stroke="#0047ff" strokeWidth="0.5" strokeDasharray="1 5" />
        <circle cx="100" cy="100" r="70" stroke="#00a3ff" strokeWidth="0.5" />
        <path d="M100 4 L100 30 M100 170 L100 196 M4 100 L30 100 M170 100 L196 100" stroke="#00e5ff" strokeWidth="0.6" />
      </svg>

      {/* نقاط "نجوم" متلألئة خفيفة جدًا، موزّعة بعشوائية ثابتة */}
      <div className="absolute inset-0">
        {[
          [8, 12], [22, 38], [35, 8], [48, 55], [62, 20], [74, 48],
          [86, 14], [14, 70], [30, 82], [55, 75], [68, 90], [90, 66],
          [5, 48], [95, 35], [44, 30],
        ].map(([x, y], i) => (
          <span
            key={i}
            className="bg-star absolute w-[3px] h-[3px] rounded-full bg-[#00e5ff]"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${(i % 7) * 0.6}s`,
            }}
          />
        ))}
      </div>

      {/* 4. تأثير إضاءة شعاعية في منتصف الشاشة لإبراز المحتوى والمنتجات */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030712_95%)]" />

      {/* 5. خط أفق نيون هادئ أعلى الصفحة */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00e5ff]/40 to-transparent" />
    </div>
  );
};
