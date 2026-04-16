import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { GoalsProvider } from "@/lib/context/GoalsContext";
import { UserProvider } from "@/lib/context/UserContext";
import { getAllUsers } from "@/lib/actions/entries";
import { getGoalsForAllUsers } from "@/lib/actions/goals";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
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
  const [users, goals] = await Promise.all([getAllUsers(), getGoalsForAllUsers()]);

  return (
    <html lang="en" className={nunito.variable}>
      <body>
        <UserProvider users={users}>
          <GoalsProvider goals={goals}>{children}</GoalsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
