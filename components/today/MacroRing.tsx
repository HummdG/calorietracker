"use client";

import { useEffect, useRef } from "react";
import { macroEmoji, macroLabel, macroUnit, type MacroKey } from "@/lib/utils/macros";
import { calcPercentage } from "@/lib/utils/macros";
import { cn } from "@/lib/utils/cn";

interface MacroRingProps {
  type: MacroKey;
  value: number | null;
  target: number;
  color: string; // 'hummd' | 'hafsa'
  size?: number;
}

const ringColors: Record<MacroKey, string> = {
  calories: "#f97316",
  protein: "#8b5cf6",
  fibre: "#22c55e",
};

const ringBg: Record<MacroKey, string> = {
  calories: "#fff7ed",
  protein: "#f5f3ff",
  fibre: "#f0fdf4",
};

export function MacroRing({ type, value, target, size = 88 }: MacroRingProps) {
  const percent = calcPercentage(value, target);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.setProperty("--circumference", String(circumference));
      circleRef.current.style.setProperty("--target-offset", String(offset));
      circleRef.current.style.strokeDashoffset = String(circumference);
      // Trigger animation
      void circleRef.current.getBoundingClientRect();
      circleRef.current.classList.add("animate-ring-fill");
    }
  }, [circumference, offset]);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative flex items-center justify-center rounded-full"
        style={{ width: size, height: size, background: ringBg[type] }}
      >
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={6}
          />
          {/* Progress */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColors[type]}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transition: "none" }}
          />
        </svg>

        {/* Center content */}
        <div className="relative text-center z-10">
          <p className="text-base leading-none">{macroEmoji(type)}</p>
          <p className="text-xs font-bold text-gray-700 mt-0.5 leading-none">
            {percent}%
          </p>
        </div>
      </div>

      {/* Label below ring */}
      <div className="text-center">
        <p className="text-xs font-bold text-gray-600">{macroLabel(type)}</p>
        <p className="text-xs text-gray-400">
          {value ?? "—"}{value != null ? macroUnit(type) : ""}
          {" / "}
          {target}{macroUnit(type)}
        </p>
      </div>
    </div>
  );
}
