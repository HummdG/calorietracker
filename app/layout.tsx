import type { Metadata } from "next";
import { Fraunces, Kalam } from "next/font/google";
import "./globals.css";
import { GoalsProvider } from "@/lib/context/GoalsContext";
import { UserProvider } from "@/lib/context/UserContext";
import { getAllUsers } from "@/lib/actions/entries";
import { getGoalsForAllUsers } from "@/lib/actions/goals";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
  weight: "variable",
});

const kalam = Kalam({
  subsets: ["latin"],
  variable: "--font-kalam",
  display: "swap",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Calorie Tracker ✨",
  description: "Our daily nutrition tracker — Hummd & Hafsa",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [users, goals] = await Promise.all([
    getAllUsers().catch(() => []),
    getGoalsForAllUsers().catch(() => []),
  ]);

  return (
    <html lang="en" className={`${fraunces.variable} ${kalam.variable}`}>
      <body>
        <UserProvider users={users}>
          <GoalsProvider goals={goals}>{children}</GoalsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
