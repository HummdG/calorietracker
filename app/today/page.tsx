import { getAllUsers, getEntriesForDate } from "@/lib/actions/entries";
import { getGoalsForAllUsers } from "@/lib/actions/goals";
import { getWeightsForDate } from "@/lib/actions/weights";
import { getLockInProgress } from "@/lib/actions/streak";
import { TodayPage } from "@/components/today/TodayPage";
import { AppShell } from "@/components/layout/AppShell";

export const dynamic = "force-dynamic";

export default async function Page() {
  const today = new Date();

  const [users, entries, goals, weights, lockIn] = await Promise.all([
    getAllUsers(),
    getEntriesForDate(today),
    getGoalsForAllUsers(),
    getWeightsForDate(today),
    getLockInProgress(),
  ]);

  return (
    <AppShell users={users}>
      <TodayPage
        users={users}
        entries={entries}
        goals={goals}
        weights={weights}
        lockIn={lockIn}
        date={today}
      />
    </AppShell>
  );
}
