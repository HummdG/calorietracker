"use client";

import Link from "next/link";
import { format, isSameMonth, isToday, startOfWeek, addDays } from "date-fns";
import { getDaysInMonth, formatDateSlug } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

interface CalendarGridProps {
  month: Date;
  // Set of date strings (YYYY-MM-DD) → how many users logged
  loggedDates: Record<string, number>;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ month, loggedDates }: CalendarGridProps) {
  const days = getDaysInMonth(month);
  const firstDay = days[0];
  const startOffset = firstDay.getDay(); // 0 = Sunday

  // Pad start
  const paddedDays: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...days,
  ];

  return (
    <div>
      {/* Month title */}
      <h2 className="text-lg font-extrabold text-gray-700 mb-4">
        {format(month, "MMMM yyyy")}
      </h2>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-300 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {paddedDays.map((day, idx) => {
          if (!day) return <div key={`pad-${idx}`} />;

          const dateStr = format(day, "yyyy-MM-dd");
          const logged = loggedDates[dateStr] ?? 0;
          const today = isToday(day);
          const slug = formatDateSlug(day);

          return (
            <Link
              key={dateStr}
              href={logged > 0 || today ? `/history/${slug}` : "#"}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all duration-150",
                logged > 0 || today
                  ? "cursor-pointer hover:scale-105"
                  : "cursor-default",
                today
                  ? "bg-gray-800 text-white shadow-sm"
                  : logged === 2
                  ? "bg-gradient-to-br from-hummd-200 to-hafsa-200 text-gray-700 shadow-sm"
                  : logged === 1
                  ? "bg-gray-100 text-gray-600"
                  : "text-gray-300"
              )}
            >
              <span>{format(day, "d")}</span>
              {logged > 0 && !today && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: logged }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1 h-1 rounded-full",
                        i === 0 ? "bg-hummd-400" : "bg-hafsa-400"
                      )}
                    />
                  ))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
