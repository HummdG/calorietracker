"use client";

import Link from "next/link";
import { format, isToday } from "date-fns";
import { getDaysInMonth, formatDateSlug } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

interface CalendarGridProps {
  month: Date;
  loggedDates: Record<string, number>;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ month, loggedDates }: CalendarGridProps) {
  const days = getDaysInMonth(month);
  const startOffset = days[0].getDay();
  const paddedDays: (Date | null)[] = [...Array(startOffset).fill(null), ...days];

  return (
    <div>
      <h2
        className="font-fraunces font-black text-lg mb-5"
        style={{ color: "var(--ink)", transform: "rotate(-0.4deg)", display: "inline-block" }}
      >
        {format(month, "MMMM yyyy")} ✦
      </h2>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center font-fraunces font-bold"
            style={{ fontSize: "10px", color: "var(--ink-light)", letterSpacing: "0.04em" }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1.5">
        {paddedDays.map((day, idx) => {
          if (!day) return <div key={`pad-${idx}`} />;

          const dateStr = format(day, "yyyy-MM-dd");
          const logged = loggedDates[dateStr] ?? 0;
          const today = isToday(day);
          const slug = formatDateSlug(day);
          const clickable = logged > 0 || today;

          return (
            <Link
              key={dateStr}
              href={clickable ? `/history/${slug}` : "#"}
              className={cn(
                "aspect-square flex flex-col items-center justify-center font-fraunces font-bold transition-all duration-150",
                clickable ? "cursor-pointer hover:-translate-y-0.5" : "cursor-default"
              )}
              style={{
                fontSize: "12px",
                borderRadius: "3px 7px 4px 6px",
                background: today
                  ? "var(--ink)"
                  : logged === 2
                  ? "linear-gradient(135deg, var(--hummd-paper) 0%, var(--hafsa-paper) 100%)"
                  : logged === 1
                  ? "var(--paper-2)"
                  : "transparent",
                color: today ? "var(--paper-0)" : "var(--ink)",
                border: today
                  ? "2px solid var(--ink)"
                  : logged > 0
                  ? "1.5px solid rgba(28,16,6,0.12)"
                  : "1.5px solid transparent",
                boxShadow: logged > 0 ? "var(--shadow-xs)" : "none",
                opacity: !logged && !today ? 0.4 : 1,
              }}
            >
              <span>{format(day, "d")}</span>
              {logged > 0 && !today && (
                <div className="flex gap-0.5 mt-0.5">
                  {Array.from({ length: logged }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: i === 0 ? "var(--hummd)" : "var(--hafsa)" }}
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
