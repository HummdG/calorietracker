import { getAllUsers, getEntriesForDate } from "@/lib/actions/entries";
import { getGoalsForAllUsers } from "@/lib/actions/goals";
import { TodayPage } from "@/components/today/TodayPage";
import { AppShell } from "@/components/layout/AppShell";

export const dynamic = "force-dynamic";

export default async function Page() {
  const today = new Date();

  const [users, entries, goals] = await Promise.all([
    getAllUsers(),
    getEntriesForDate(today),
    getGoalsForAllUsers(),
  ]);

  return (
    <AppShell users={users}>
      <TodayPage
        users={users}
        entries={entries}
        goals={goals}
        date={today}
      />
    </AppShell>
  );
}
