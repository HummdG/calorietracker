"use client";

import { useEffect, useRef } from "react";
import { macroEmoji, macroLabel, macroUnit, type MacroKey } from "@/lib/utils/macros";
import { calcPercentage } from "@/lib/utils/macros";

interface MacroRingProps {
  type: MacroKey;
  value: number | null;
  target: number;
  color: string;
  size?: number;
}

const ringColors: Record<MacroKey, string> = {
  calories: "#CC4A18",
  protein:  "#5E3A98",
  fibre:    "#2E7844",
};

const ringBg: Record<MacroKey, string> = {
  calories: "#F8EDE6",
  protein:  "#EEE8F8",
  fibre:    "#E6F2EA",
};

const ringTrack: Record<MacroKey, string> = {
  calories: "rgba(204,74,24,0.14)",
  protein:  "rgba(94,58,152,0.14)",
  fibre:    "rgba(46,120,68,0.14)",
};

export function MacroRing({ type, value, target, size = 90 }: MacroRingProps) {
  const percent = calcPercentage(value, target);
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!circleRef.current) return;
    const el = circleRef.current;
    el.style.setProperty("--circumference", String(circumference));
    el.style.setProperty("--target-offset", String(offset));
    el.style.strokeDashoffset = String(circumference);
    void el.getBoundingClientRect();
    el.classList.add("animate-ring-fill");
  }, [circumference, offset]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Ring — like a drawn circle on paper */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: size,
          height: size,
          background: ringBg[type],
          border: "1.5px solid rgba(28,16,6,0.08)",
          // Slightly uneven: papercraft circle
          borderRadius: "52% 48% 50% 50% / 50% 48% 52% 50%",
          boxShadow: "1px 1px 0 rgba(28,16,6,0.10), 0 3px 8px rgba(28,16,6,0.10)",
        }}
      >
        <svg
          width={size}
          height={size}
          className="absolute inset-0"
          style={{ transform: "rotate(-88deg)" }} // slightly off 90° — hand-drawn feel
        >
          {/* Track ring — like pencil guideline */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringTrack[type]}
            strokeWidth={7}
            strokeLinecap="round"
            // Slightly imperfect — like drawn by hand
            strokeDasharray={`${circumference * 0.96} ${circumference * 0.04}`}
          />
          {/* Progress arc — like marker drawn over pencil */}
          <circle
            ref={circleRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColors[type]}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ filter: `drop-shadow(0 0 3px ${ringColors[type]}40)` }}
          />
        </svg>

        {/* Center — value label */}
        <div className="relative z-10 text-center leading-none">
          <div className="text-base">{macroEmoji(type)}</div>
          <div
            className="font-fraunces font-black text-sm mt-0.5"
            style={{ color: ringColors[type] }}
          >
            {percent}%
          </div>
        </div>

        {/* Small pen-dot at start of ring (hand-drawn detail) */}
        <div
          className="absolute"
          style={{
            top: "8px",
            right: "calc(50% - 4px)",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: ringColors[type],
            opacity: 0.5,
          }}
        />
      </div>

      {/* Label below */}
      <div className="text-center">
        <p
          className="font-fraunces font-bold text-xs"
          style={{ color: "var(--ink)" }}
        >
          {macroLabel(type)}
        </p>
        <p
          className="text-xs"
          style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
        >
          {value != null ? `${value}${macroUnit(type)}` : "—"}
          {" / "}
          {target}{macroUnit(type)}
        </p>
      </div>
    </div>
  );
}
