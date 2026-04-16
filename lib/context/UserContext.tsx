"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { UserRow } from "@/lib/supabase/types";

type UserContextValue = {
  activeUser: UserRow | null;
  setActiveUser: (user: UserRow) => void;
  clearUser: () => void;
};

const UserContext = createContext<UserContextValue>({
  activeUser: null,
  setActiveUser: () => {},
  clearUser: () => {},
});

const STORAGE_KEY = "ct_active_user";

export function UserProvider({
  children,
  users,
}: {
  children: React.ReactNode;
  users: UserRow[];
}) {
  const [activeUser, setActiveUserState] = useState<UserRow | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserRow;
        // Verify the stored user still matches a real user from DB
        const found = users.find((u) => u.id === parsed.id);
        if (found) setActiveUserState(found);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [users]);

  const setActiveUser = (user: UserRow) => {
    setActiveUserState(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  const clearUser = () => {
    setActiveUserState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (!mounted) return null;

  return (
    <UserContext.Provider value={{ activeUser, setActiveUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useCurrentUser() {
  return useContext(UserContext);
}
