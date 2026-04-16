"use client";

import { useCurrentUser } from "@/lib/context/UserContext";
import type { UserRow } from "@/lib/supabase/types";
import { cn } from "@/lib/utils/cn";

export function UserSplash({ users }: { users: UserRow[] }) {
  const { setActiveUser } = useCurrentUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50 flex flex-col items-center justify-center p-6">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-hafsa-200 rounded-full opacity-30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-hummd-200 rounded-full opacity-30 blur-3xl pointer-events-none" />

      <div className="text-center mb-10 animate-fade-in">
        <p className="text-5xl mb-3">✨</p>
        <h1 className="text-3xl font-extrabold text-gray-800">Hey there!</h1>
        <p className="text-gray-400 mt-2 text-base font-medium">Who&apos;s logging today?</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-sm sm:max-w-md animate-fade-in">
        {users.map((user) => {
          const isHummd = user.color === "hummd";
          return (
            <button
              key={user.id}
              onClick={() => setActiveUser(user)}
              className={cn(
                "flex-1 flex flex-col items-center gap-4 p-8 rounded-3xl border-2 font-semibold transition-all duration-200",
                "hover:scale-105 hover:shadow-xl active:scale-95",
                isHummd
                  ? "bg-white border-hummd-200 hover:border-hummd-400 hover:bg-hummd-50"
                  : "bg-white border-hafsa-200 hover:border-hafsa-400 hover:bg-hafsa-50"
              )}
            >
              <div
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center text-5xl shadow-sm",
                  isHummd ? "bg-hummd-100" : "bg-hafsa-100"
                )}
              >
                {user.emoji}
              </div>
              <span
                className={cn(
                  "text-xl font-extrabold",
                  isHummd ? "text-hummd-700" : "text-hafsa-700"
                )}
              >
                {user.name}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-8 text-xs text-gray-300 animate-fade-in">
        Your daily nutrition, tracked with love 💕
      </p>
    </div>
  );
}
