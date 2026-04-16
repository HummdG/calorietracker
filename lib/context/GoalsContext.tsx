"use client";

import React, { createContext, useContext } from "react";
import type { GoalsRow } from "@/lib/supabase/types";

type GoalsMap = Record<string, GoalsRow>; // keyed by user_id

const GoalsContext = createContext<GoalsMap>({});

export function GoalsProvider({
  children,
  goals,
}: {
  children: React.ReactNode;
  goals: GoalsRow[];
}) {
  const goalsMap: GoalsMap = {};
  for (const g of goals) {
    goalsMap[g.user_id] = g;
  }
  return <GoalsContext.Provider value={goalsMap}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  return useContext(GoalsContext);
}

export function useGoalsForUser(userId: string): GoalsRow | null {
  const goals = useContext(GoalsContext);
  return goals[userId] ?? null;
}
