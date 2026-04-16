import type { UserRow, EntryRow } from "@/lib/supabase/types";
import { EmojiAvatar } from "@/components/ui/EmojiAvatar";
import { MacroBadge } from "@/components/ui/MacroBadge";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface DayEntryRowProps {
  user: UserRow;
  entry: EntryRow | null;
}

export function DayEntryRow({ user, entry }: DayEntryRowProps) {
  const isHummd = user.color === "hummd";

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-2xl border",
        isHummd ? "bg-hummd-50 border-hummd-100" : "bg-hafsa-50 border-hafsa-100"
      )}
    >
      <EmojiAvatar emoji={user.emoji} color={user.color} size="sm" />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-bold text-sm mb-2",
            isHummd ? "text-hummd-700" : "text-hafsa-700"
          )}
        >
          {user.name}
        </p>

        {entry ? (
          <div className="flex flex-wrap gap-1.5">
            {entry.calories != null && (
              <MacroBadge type="calories" value={entry.calories} color={user.color} size="sm" />
            )}
            {entry.protein != null && (
              <MacroBadge type="protein" value={entry.protein} color={user.color} size="sm" />
            )}
            {entry.fibre != null && (
              <MacroBadge type="fibre" value={entry.fibre} color={user.color} size="sm" />
            )}
            {entry.calories_burnt != null && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
                <Flame className="w-3 h-3" />
                {entry.calories_burnt} burnt
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic">No entry logged</p>
        )}
      </div>
    </div>
  );
}
