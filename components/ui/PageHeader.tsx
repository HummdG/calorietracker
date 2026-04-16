import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  right?: React.ReactNode;
  className?: string;
  tilt?: string;
}

export function PageHeader({ title, subtitle, backHref, right, className, tilt = "0.5deg" }: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)} style={{ transform: `rotate(${tilt})` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backHref && (
            <Link
              href={backHref}
              className="flex items-center justify-center w-9 h-9 transition-all hover:-rotate-6"
              style={{
                background: "var(--paper-0)",
                border: "2px solid rgba(28,16,6,0.15)",
                borderRadius: "5px 9px 6px 8px",
                boxShadow: "2px 2px 0 rgba(28,16,6,0.12)",
                color: "var(--ink-mid)",
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}
          <div>
            <h1
              className="font-fraunces font-black text-2xl leading-tight"
              style={{ color: "var(--ink)" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--ink-light)", fontFamily: "var(--font-kalam)" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {right && <div>{right}</div>}
      </div>
    </div>
  );
}
