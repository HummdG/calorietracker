import { getAllUsers } from "@/lib/actions/entries";
import { AppShell } from "@/components/layout/AppShell";
import { LogForm } from "@/components/today/LogForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmojiAvatar } from "@/components/ui/EmojiAvatar";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const today = new Date();

  const users = await getAllUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) notFound();

  return (
    <AppShell users={users}>
      <PageHeader
        title={`Log for ${user.name}`}
        backHref="/today"
        right={<EmojiAvatar emoji={user.emoji} color={user.color} size="md" />}
      />

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6">
          <LogForm
            user={user}
            date={today}
            onSuccess={() => redirect("/today")}
          />
        </div>
      </div>
    </AppShell>
  );
}
