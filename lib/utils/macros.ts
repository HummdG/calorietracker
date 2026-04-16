export type MacroKey = "calories" | "protein" | "fibre";

export function calcPercentage(value: number | null | undefined, target: number): number {
  if (!value || !target) return 0;
  return Math.min(Math.round((value / target) * 100), 100);
}

export function colorForUser(color: string): {
  ring: string;
  bg: string;
  text: string;
  border: string;
  button: string;
  badge: string;
  light: string;
} {
  if (color === "hummd") {
    return {
      ring: "#0ea5e9",
      bg: "bg-hummd-50",
      text: "text-hummd-700",
      border: "border-hummd-200",
      button: "bg-hummd-500 hover:bg-hummd-600 text-white",
      badge: "bg-hummd-100 text-hummd-700",
      light: "bg-hummd-100",
    };
  }
  return {
    ring: "#f43f5e",
    bg: "bg-hafsa-50",
    text: "text-hafsa-700",
    border: "border-hafsa-200",
    button: "bg-hafsa-500 hover:bg-hafsa-600 text-white",
    badge: "bg-hafsa-100 text-hafsa-700",
    light: "bg-hafsa-100",
  };
}

export function macroLabel(key: MacroKey): string {
  return { calories: "Calories", protein: "Protein", fibre: "Fibre" }[key];
}

export function macroUnit(key: MacroKey): string {
  return { calories: "kcal", protein: "g", fibre: "g" }[key];
}

export function macroEmoji(key: MacroKey): string {
  return { calories: "🔥", protein: "🥩", fibre: "🥦" }[key];
}

export function macroColor(key: MacroKey): string {
  return {
    calories: "#f97316",
    protein: "#8b5cf6",
    fibre: "#22c55e",
  }[key];
}
