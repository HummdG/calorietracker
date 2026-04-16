"use client";

import { useCurrentUser } from "@/lib/context/UserContext";
import type { UserRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

export function UserSplash({ users }: { users: UserRow[] }) {
  const { setActiveUser } = useCurrentUser();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden relative"
      style={{ background: "var(--bg)" }}
    >
      {/* Stage backing — cardboard wall texture layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 39px, rgba(100,78,30,0.04) 39px, rgba(100,78,30,0.04) 40px)",
        }}
      />

      {/* Proscenium arch — top decoration */}
      <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
        <svg viewBox="0 0 900 180" className="w-full max-w-3xl opacity-40" preserveAspectRatio="xMidYMin slice">
          <path
            d="M0,180 L0,90 Q50,0 200,0 L700,0 Q850,0 900,90 L900,180 Z"
            fill="var(--paper-4)"
            stroke="var(--ink)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Arch decorative cuts */}
          {[80,160,240,320,400,480,560,640,720,800].map((x, i) => (
            <circle key={i} cx={x} cy={10} r={3.5} fill="var(--ink)" opacity="0.4" />
          ))}
          <text x="450" y="55" textAnchor="middle" fontSize="18" fill="var(--ink)" fontFamily="var(--font-fraunces)" opacity="0.6" fontWeight="700">
            ✦ NUTRITION THEATRE ✦
          </text>
        </svg>
      </div>

      {/* Stage floor line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none"
        style={{ background: "var(--paper-4)", borderTop: "2px solid var(--ink)", opacity: 0.5 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Title card — pinned to the stage */}
        <div
          className="paper-card tape-strip text-center px-10 py-6 animate-paper-drop"
          style={{
            "--card-tilt": "-0.8deg",
            transform: "rotate(-0.8deg)",
            maxWidth: "380px",
          } as React.CSSProperties}
        >
          <p className="font-fraunces font-black text-3xl leading-none" style={{ color: "var(--ink)" }}>
            Who&apos;s on<br />
            <span style={{ color: "var(--hafsa)", fontStyle: "italic" }}>stage</span>
            {" "}today?
          </p>
          <p className="mt-3 text-sm" style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}>
            Pick your character to start logging ✦
          </p>
        </div>

        {/* Character cards */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
          {users.map((user, idx) => {
            const isHummd = user.color === "hummd";
            const tilt = isHummd ? "-2.5deg" : "2deg";
            const delay = idx === 0 ? "0.12s" : "0.24s";
            const bg = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
            const accent = isHummd ? "var(--hummd)" : "var(--hafsa)";
            const accentDark = isHummd ? "var(--hummd-dark)" : "var(--hafsa-dark)";
            const pale = isHummd ? "var(--hummd-pale)" : "var(--hafsa-pale)";

            return (
              <button
                key={user.id}
                onClick={() => setActiveUser(user)}
                className={cn(
                  "relative flex flex-col items-center gap-5 px-8 pt-10 pb-8",
                  "cursor-pointer group animate-paper-drop"
                )}
                style={{
                  "--card-tilt": tilt,
                  animationDelay: delay,
                  transform: `rotate(${tilt})`,
                  width: "180px",
                } as React.CSSProperties}
              >
                {/* Paper stack layers (behind) */}
                <div
                  className="absolute inset-0 rounded-paper"
                  style={{
                    background: "var(--paper-3)",
                    transform: `translate(8px, 10px) rotate(3deg)`,
                    border: "1.5px solid rgba(28,16,6,0.08)",
                  }}
                />
                <div
                  className="absolute inset-0 rounded-paper"
                  style={{
                    background: "var(--paper-2)",
                    transform: `translate(4px, 5px) rotate(1.5deg)`,
                    border: "1.5px solid rgba(28,16,6,0.09)",
                  }}
                />

                {/* Card face */}
                <div
                  className="absolute inset-0 rounded-paper transition-all duration-200 group-hover:-translate-y-2 group-hover:rotate-0"
                  style={{
                    background: bg,
                    border: `2.5px solid ${accent}`,
                    boxShadow: "var(--shadow-card)",
                  }}
                />

                {/* Tape */}
                <div
                  className="absolute -top-3 left-1/2"
                  style={{
                    transform: `translateX(-50%) rotate(${isHummd ? "-2deg" : "2deg"})`,
                    width: "56px",
                    height: "16px",
                    background: "var(--tape-bg)",
                    border: "1px solid var(--tape-border)",
                    borderRadius: "2px",
                    zIndex: 20,
                    boxShadow: "0 1px 3px rgba(28,16,6,0.12)",
                  }}
                />

                {/* Content (above all layers) */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  {/* Emoji circle — like a paper sticker */}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-5xl"
                    style={{
                      background: pale,
                      border: `2px solid ${accent}`,
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    {user.emoji}
                  </div>

                  {/* Name — like a label written in marker */}
                  <div className="text-center">
                    <p
                      className="font-fraunces font-black text-2xl leading-tight"
                      style={{ color: accentDark }}
                    >
                      {user.name}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: accent, fontFamily: "var(--font-kalam)" }}
                    >
                      tap to enter
                    </p>
                  </div>
                </div>

                {/* Corner decoration */}
                <div
                  className="absolute bottom-2 right-3 text-lg opacity-30 z-10"
                  style={{ color: accent }}
                >
                  ✦
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer note */}
        <p
          className="text-xs opacity-50 mt-2 animate-paper-drop"
          style={{
            animationDelay: "0.4s",
            color: "var(--ink-mid)",
            fontFamily: "var(--font-kalam)",
            transform: "rotate(0.5deg)",
          }}
        >
          your daily nutrition, tracked with love 💕
        </p>
      </div>

      {/* Decorative corner pins */}
      {[
        { top: "10%", left: "5%", rot: "12deg", color: "var(--hummd)" },
        { top: "15%", right: "6%", rot: "-8deg", color: "var(--hafsa)" },
        { bottom: "12%", left: "8%", rot: "-15deg", color: "var(--fib-green, #2E7844)" },
        { bottom: "10%", right: "5%", rot: "20deg", color: "var(--cal-color, #CC4A18)" },
      ].map((pin, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            ...{ top: pin.top, left: pin.left, right: pin.right, bottom: pin.bottom },
            transform: `rotate(${pin.rot})`,
            opacity: 0.35,
          }}
        >
          <svg width="28" height="40" viewBox="0 0 28 40">
            <ellipse cx="14" cy="10" rx="10" ry="10" fill={pin.color} />
            <rect x="12.5" y="18" width="3" height="20" rx="1.5" fill={pin.color} />
            <ellipse cx="14" cy="10" rx="5" ry="5" fill="white" opacity="0.4" />
          </svg>
        </div>
      ))}
    </div>
  );
}
