import { getAllUsers, getEntriesForRange } from "@/lib/actions/entries";
import { getGoalsForAllUsers } from "@/lib/actions/goals";
import { AppShell } from "@/components/layout/AppShell";
import { ProgressPage } from "@/components/charts/ProgressPage";
import { getLastNDays, formatDateISO } from "@/lib/utils/dates";

export const dynamic = "force-dynamic";

export default async function Page() {
  const last7 = getLastNDays(7);
  const start = last7[0];
  const end = last7[last7.length - 1];

  const [users, entries, goals] = await Promise.all([
    getAllUsers(),
    getEntriesForRange(start, end),
    getGoalsForAllUsers(),
  ]);

  const days = last7.map(formatDateISO);

  return (
    <AppShell users={users}>
      <ProgressPage users={users} entries={entries} goals={goals} days={days} />
    </AppShell>
  );
}
