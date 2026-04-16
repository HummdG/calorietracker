import { getAllUsers, getEntriesForDate } from "@/lib/actions/entries";
import { AppShell } from "@/components/layout/AppShell";
import { DayEntryRow } from "@/components/history/DayEntryRow";
import { PageHeader } from "@/components/ui/PageHeader";
import { parseSlugDate, formatDateFull } from "@/lib/utils/dates";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DateDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date: dateSlug } = await params;

  let date: Date;
  try {
    date = parseSlugDate(dateSlug);
    if (isNaN(date.getTime())) notFound();
  } catch {
    notFound();
  }

  const [users, entries] = await Promise.all([
    getAllUsers(),
    getEntriesForDate(date),
  ]);

  return (
    <AppShell users={users}>
      <PageHeader
        title={formatDateFull(date)}
        backHref="/history"
      />

      <div className="space-y-3">
        {users.map((user) => {
          const entry = entries.find((e) => e.user_id === user.id) ?? null;
          return <DayEntryRow key={user.id} user={user} entry={entry} />;
        })}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400 font-medium">No entries logged for this day</p>
        </div>
      )}
    </AppShell>
  );
}
