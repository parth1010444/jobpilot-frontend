import type { ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

export function Field({
  children,
  className,
  error,
}: {
  children: ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
