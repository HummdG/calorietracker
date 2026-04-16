"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, TrendingUp, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCurrentUser } from "@/lib/context/UserContext";
import { EmojiAvatar } from "@/components/ui/EmojiAvatar";

const navItems = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/history", label: "History", icon: Calendar },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();
  const { activeUser, clearUser } = useCurrentUser();
  const isHummd = activeUser?.color === "hummd";

  if (!activeUser) return null;

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-white border-r border-gray-100 z-40">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <p className="text-2xl font-extrabold text-gray-800">
          ✨ Nutrition
        </p>
        <p className="text-sm text-gray-400 font-medium mt-0.5">Track your goals</p>
      </div>

      {/* User pill */}
      <div
        className={cn(
          "mx-4 mb-6 p-3 rounded-2xl flex items-center gap-3",
          isHummd ? "bg-hummd-50" : "bg-hafsa-50"
        )}
      >
        <EmojiAvatar emoji={activeUser.emoji} color={activeUser.color} size="sm" />
        <div className="flex-1 min-w-0">
          <p className={cn("font-bold text-sm", isHummd ? "text-hummd-700" : "text-hafsa-700")}>
            {activeUser.name}
          </p>
          <p className="text-xs text-gray-400">Logged in</p>
        </div>
        <button
          onClick={clearUser}
          title="Switch user"
          className="text-gray-300 hover:text-gray-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-150",
                active
                  ? isHummd
                    ? "bg-hummd-100 text-hummd-700"
                    : "bg-hafsa-100 text-hafsa-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <p className="text-xs text-gray-300 text-center">Made with 💕</p>
      </div>
    </aside>
  );
}
