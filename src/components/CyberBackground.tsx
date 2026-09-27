"use client";

import React from "react";

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#030712]">
      {/* 1. أضواء النيون التفاعلية في الخلفية */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px] animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-pink-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '6s' }} />

      {/* 2. شبكة خطوط السايبر التفاعلية (Cyber Grid Overlay) */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* 3. طبقة تظليل من الأطراف (Vignette) لاحتواء التصميم وإبراز المنتجات */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80" />
    </div>
  );
};
