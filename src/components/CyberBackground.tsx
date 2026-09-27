"use client";

import React from "react";

export const CyberBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* خلفية التوهج والشبكة */}
      <div className="absolute inset-0 bg-[#03060c]" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(rgba(0, 163, 255, 0.4) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#00a3ff]/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#00e5ff]/15 rounded-full blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-[#ff0055]/15 rounded-full blur-[140px]" />
    </div>
  );
};
