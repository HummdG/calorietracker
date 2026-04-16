import { getAllUsers } from "@/lib/actions/entries";
import { getGoalsForAllUsers } from "@/lib/actions/goals";
import { AppShell } from "@/components/layout/AppShell";
import { GoalForm } from "@/components/settings/GoalForm";
import { PageHeader } from "@/components/ui/PageHeader";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [users, goals] = await Promise.all([
    getAllUsers(),
    getGoalsForAllUsers(),
  ]);

  return (
    <AppShell users={users}>
      <PageHeader
        title="Settings ⚙️"
        subtitle="Set your daily nutrition goals"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => {
          const userGoals = goals.find((g) => g.user_id === user.id) ?? null;
          return <GoalForm key={user.id} user={user} goals={userGoals} />;
        })}
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
        <p className="text-sm text-amber-700 font-medium">
          💡 Goals are used to calculate the progress rings on the Today page. Update them anytime!
        </p>
      </div>
    </AppShell>
  );
}
