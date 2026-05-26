import { getAllUsers, getEntriesForDate } from "@/lib/actions/entries";
import { getGoalsForAllUsers } from "@/lib/actions/goals";
import { getWeightsForDate } from "@/lib/actions/weights";
import { getSharedStreak } from "@/lib/actions/streak";
import { TodayPage } from "@/components/today/TodayPage";
import { AppShell } from "@/components/layout/AppShell";

export const dynamic = "force-dynamic";

export default async function Page() {
  const today = new Date();

  const [users, entries, goals, weights, streak] = await Promise.all([
    getAllUsers(),
    getEntriesForDate(today),
    getGoalsForAllUsers(),
    getWeightsForDate(today),
    getSharedStreak(),
  ]);

  return (
    <AppShell users={users}>
      <TodayPage
        users={users}
        entries={entries}
        goals={goals}
        weights={weights}
        streak={streak}
        date={today}
      />
    </AppShell>
  );
}
