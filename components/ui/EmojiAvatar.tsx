import { cn } from "@/lib/utils/cn";

interface EmojiAvatarProps {
  emoji: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8  h-8  text-lg",
  md: "w-10 h-10 text-xl",
  lg: "w-14 h-14 text-3xl",
  xl: "w-20 h-20 text-5xl",
};

export function EmojiAvatar({ emoji, color, size = "md", className }: EmojiAvatarProps) {
  const isHummd = color === "hummd";
  return (
    <div
      className={cn("flex items-center justify-center select-none", sizeClasses[size], className)}
      style={{
        background: isHummd ? "var(--hummd-light)" : "var(--hafsa-light)",
        border: `2px solid ${isHummd ? "var(--hummd)" : "var(--hafsa)"}`,
        borderRadius: "52% 48% 50% 50% / 50% 48% 52% 50%", /* organic circle */
        boxShadow: "var(--shadow-xs)",
      }}
    >
      {emoji}
    </div>
  );
}
