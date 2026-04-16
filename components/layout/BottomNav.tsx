"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCurrentUser } from "@/lib/context/UserContext";

const navItems = [
  { href: "/today",    label: "Today",    icon: Home },
  { href: "/history",  label: "History",  icon: Calendar },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { activeUser } = useCurrentUser();
  const isHummd = activeUser?.color === "hummd";
  const accent = isHummd ? "var(--hummd)" : "var(--hafsa)";
  const accentPaper = isHummd ? "var(--hummd-paper)" : "var(--hafsa-paper)";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{
        background: "var(--paper-1)",
        borderTop: "2px solid rgba(28,16,6,0.12)",
        boxShadow: "0 -3px 14px rgba(28,16,6,0.12)",
      }}
    >
      <div className="flex items-end justify-around px-2 pt-1 pb-2 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-0"
              style={{ flex: 1 }}
            >
              {/* Active tab lifts up like a paper tab */}
              {active && (
                <div
                  className="absolute inset-0 rounded-t-paper -top-1"
                  style={{
                    background: accentPaper,
                    border: `1.5px solid ${accent}`,
                    borderBottom: "none",
                    transform: "rotate(-0.3deg)",
                    boxShadow: "0 -2px 8px rgba(28,16,6,0.10)",
                  }}
                />
              )}
              <Icon
                className="relative z-10 w-5 h-5 transition-all duration-150"
                strokeWidth={active ? 2.5 : 1.6}
                style={{ color: active ? accent : "var(--ink-light)" }}
              />
              <span
                className="relative z-10 font-fraunces font-semibold"
                style={{
                  fontSize: "9px",
                  color: active ? "var(--ink)" : "var(--ink-light)",
                  letterSpacing: "0.02em",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
