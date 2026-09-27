"use client";

import React from "react";

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#030712] select-none">
      {/* 1. أضواء وهالات النيون المتحركة في الزوايا والخلفية */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-purple-600/20 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '9s' }} />
      <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-pink-500/15 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '7s' }} />

      {/* 2. خطوط شبكة السايبر (Cyber Grid Pattern) */}
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

      {/* 3. تأثير إضاءة شعاعية في منتصف الشاشة لإبراز المحتوى والمنتجات */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030712_95%)]" />

      {/* 4. خط أفق نيون هادئ بعيد في الخلفية */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
    </div>
  );
};
