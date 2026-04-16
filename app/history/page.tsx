import { getAllUsers, getEntriesForRange } from "@/lib/actions/entries";
import { AppShell } from "@/components/layout/AppShell";
import { CalendarGrid } from "@/components/history/CalendarGrid";
import { PageHeader } from "@/components/ui/PageHeader";
import { format, startOfMonth, endOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const [users, entries] = await Promise.all([
    getAllUsers(),
    getEntriesForRange(start, end),
  ]);

  // Build a map: dateStr → count of users who logged
  const loggedDates: Record<string, number> = {};
  for (const entry of entries) {
    loggedDates[entry.date] = (loggedDates[entry.date] ?? 0) + 1;
  }

  return (
    <AppShell users={users}>
      <PageHeader
        title="History 📅"
        subtitle="See your past entries"
      />

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <CalendarGrid month={now} loggedDates={loggedDates} />
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 px-1">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="flex gap-0.5">
            <div className="w-2 h-2 rounded-full bg-hummd-400" />
            <div className="w-2 h-2 rounded-full bg-hafsa-400" />
          </div>
          Both logged
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-gray-300" />
          One logged
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-3 h-3 rounded-full bg-gray-800" />
          Today
        </div>
      </div>
    </AppShell>
  );
}
