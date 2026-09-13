import { type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/lib/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-10 w-full appearance-none rounded-lg border border-line-strong bg-[#0b0e16] bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 pr-8 text-sm text-ink",
      "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22><path fill=%22%239aa3b8%22 d=%22M2.2 4.2 6 8l3.8-3.8%22/></svg>')]",
      "transition-colors hover:border-line-strong focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/25",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));

Select.displayName = "Select";
