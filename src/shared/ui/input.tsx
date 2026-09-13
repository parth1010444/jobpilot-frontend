import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/lib/cn";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-10 w-full rounded-lg border border-line bg-canvas-muted px-3 text-sm text-ink placeholder:text-ink-faint",
      "transition-colors hover:border-line-strong focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/25",
      "disabled:cursor-not-allowed disabled:opacity-60",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
