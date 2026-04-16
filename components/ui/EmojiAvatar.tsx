import { cn } from "@/lib/utils/cn";

interface EmojiAvatarProps {
  emoji: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-lg",
  md: "w-10 h-10 text-xl",
  lg: "w-14 h-14 text-3xl",
  xl: "w-20 h-20 text-5xl",
};

const colorClasses: Record<string, string> = {
  hummd: "bg-hummd-100",
  hafsa: "bg-hafsa-100",
};

export function EmojiAvatar({
  emoji,
  color,
  size = "md",
  className,
}: EmojiAvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center select-none",
        sizeClasses[size],
        colorClasses[color] ?? "bg-gray-100",
        className
      )}
    >
      {emoji}
    </div>
  );
}
