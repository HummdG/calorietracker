"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, TrendingUp, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCurrentUser } from "@/lib/context/UserContext";

const navItems = [
  { href: "/today",    label: "Today",    icon: Home },
  { href: "/history",  label: "History",  icon: Calendar },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();
  const { activeUser, clearUser } = useCurrentUser();
  const isHummd = activeUser?.color === "hummd";

  const accent = isHummd ? "var(--hummd)" : "var(--hafsa)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";
  const accentLight = isHummd ? "var(--hummd-light)" : "var(--hafsa-light)";

  if (!activeUser) return null;

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col z-40"
      style={{
        background: "var(--paper-2)",
        borderRight: "2px solid rgba(28,16,6,0.12)",
        boxShadow: "3px 0 16px rgba(28,16,6,0.12)",
      }}
    >
      {/* Paper grain on sidebar */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg, transparent 0px, transparent 4px,
            rgba(100,78,30,0.025) 4px, rgba(100,78,30,0.025) 5px
          )`,
        }}
      />

      {/* Logo area — pinned paper label */}
      <div className="relative px-5 pt-7 pb-5">
        <div
          className="paper-card p-4 relative"
          style={{
            background: "var(--paper-0)",
            transform: "rotate(-0.6deg)",
          }}
        >
          {/* Small tape on logo card */}
          <div
            className="absolute -top-2 left-1/2"
            style={{
              transform: "translateX(-50%) rotate(1.2deg)",
              width: "44px",
              height: "13px",
              background: "var(--tape-bg)",
              border: "1px solid var(--tape-border)",
              borderRadius: "2px",
            }}
          />
          <p
            className="font-fraunces font-black text-xl leading-none"
            style={{ color: "var(--ink)" }}
          >
            ✦ Nutrition
          </p>
        </div>
      </div>

      {/* User badge — looks like a sticker */}
      <div className="px-5 mb-5">
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-paper"
          style={{
            background: accentPaper,
            border: `2px solid ${accent}`,
            boxShadow: "var(--shadow-xs)",
            transform: "rotate(0.4deg)",
          }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: accentLight, border: `1.5px solid ${accent}` }}
          >
            {activeUser.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-fraunces font-black text-sm leading-tight"
              style={{ color: "var(--ink)" }}
            >
              {activeUser.name}
            </p>
            <p className="text-xs" style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}>
              on stage
            </p>
          </div>
          <button
            onClick={clearUser}
            title="Switch user"
            className="flex-shrink-0 transition-opacity hover:opacity-60"
            style={{ color: "var(--ink-light)" }}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map(({ href, label, icon: Icon }, idx) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-paper",
                "transition-all duration-150 group",
                "font-fraunces font-semibold text-sm"
              )}
              style={{
                background: active ? accentPaper : "transparent",
                color: active ? "var(--ink)" : "var(--ink-mid)",
                border: active ? `1.5px solid ${accent}` : "1.5px solid transparent",
                boxShadow: active ? "var(--shadow-xs)" : "none",
                transform: active ? "rotate(-0.3deg)" : "none",
              }}
            >
              {/* Active tab-like paper piece */}
              {active && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
                  style={{ background: accent }}
                />
              )}
              <Icon
                className="w-4 h-4 flex-shrink-0"
                strokeWidth={active ? 2.5 : 1.8}
                style={{ color: active ? accent : "var(--ink-light)" }}
              />
              {label}
              {active && (
                <span
                  className="ml-auto text-xs opacity-60"
                  style={{ color: accent, fontFamily: "var(--font-kalam)" }}
                >
                  ✦
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-5">
      </div>
    </aside>
  );
}
