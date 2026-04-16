"use client";

import { useCurrentUser } from "@/lib/context/UserContext";
import { UserSplash } from "./UserSplash";
import { BottomNav } from "./BottomNav";
import { SideNav } from "./SideNav";
import type { UserRow } from "@/lib/supabase/types";

export function AppShell({
  children,
  users,
}: {
  children: React.ReactNode;
  users: UserRow[];
}) {
  const { activeUser } = useCurrentUser();

  if (!activeUser) {
    return <UserSplash users={users} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop side nav */}
      <SideNav />

      {/* Main content */}
      <main className="md:ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
