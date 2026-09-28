
"use client";

import React, { useState, useEffect } from "react";
import { Timer, Zap, Flame } from "lucide-react";

interface CountdownProps {
  targetDate: Date | string;
}

export const DealCountdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="w-full my-4">
      {/* حاوية العداد بتوهج سايبر نيون بدلاً من الأحمر */}
      <div className="relative p-[1.5px] rounded-2xl bg-gradient-to-r from-[#00a3ff]/40 via-[#00e5ff]/60 to-[#00a3ff]/40 shadow-[0_0_25px_rgba(0,163,255,0.25)]">
        <div className="bg-[#070e1c] rounded-[15px] p-4 border border-[#16294a]">
          
          {/* عنوان العداد */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#00e5ff] animate-bounce" />
            <span className="text-xs font-bold text-[#00e5ff] tracking-wider font-['Cairo']">
              ينتهي العرض الخاص خلال
            </span>
            <Timer className="w-4 h-4 text-[#00a3ff]" />
          </div>

          {/* خانات العداد: تصميم نيون أزرق وسيان */}
          <div className="grid grid-cols-3 gap-3 text-center" dir="ltr">
            
            {/* الساعات */}
            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 bg-gradient-to-b from-[#0b1b36] to-[#050b17] border border-[#00a3ff]/50 rounded-xl shadow-[inset_0_0_12px_rgba(0,163,255,0.3)]">
                <span className="text-xl sm:text-2xl font-black font-mono text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1 font-['Cairo']">ساعة</span>
            </div>

            {/* الدقائق */}
            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 bg-gradient-to-b from-[#0b1b36] to-[#050b17] border border-[#00a3ff]/50 rounded-xl shadow-[inset_0_0_12px_rgba(0,163,255,0.3)]">
                <span className="text-xl sm:text-2xl font-black font-mono text-[#00e5ff] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] font-bold text-gray-400 mt-1 font-['Cairo']">دقيقة</span>
            </div>

            {/* الثواني */}
            <div className="flex flex-col items-center">
              <div className="w-full py-2.5 bg-gradient-to-b from-[#0b1b36] to-[#050b17] border border-[#00e5ff] rounded-xl shadow-[0_0_15px_rgba(0,229,255,0.4)] animate-pulse">
                <span className="text-xl sm:text-2xl font-black font-mono text-[#00e5ff] drop-shadow-[0_0_12px_rgba(0,229,255,1)]">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#00e5ff] mt-1 font-['Cairo']">ثانية</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
