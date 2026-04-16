import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  right?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  right,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div className="flex items-center gap-2">
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors mr-1"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </Link>
        )}
        <div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right && <div>{right}</div>}
    </div>
  );
}
