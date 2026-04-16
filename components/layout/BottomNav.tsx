"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCurrentUser } from "@/lib/context/UserContext";

const navItems = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/history", label: "History", icon: Calendar },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { activeUser } = useCurrentUser();
  const isHummd = activeUser?.color === "hummd";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-100 safe-area-pb md:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200",
                active
                  ? isHummd
                    ? "text-hummd-600"
                    : "text-hafsa-600"
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-all duration-200",
                  active && "scale-110"
                )}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
