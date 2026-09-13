import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-[#0b1020] hover:bg-accent-strong shadow-[0_0_0_1px_rgb(142_162_255_/_0.25),0_10px_24px_-16px_rgb(142_162_255_/_0.8)]",
        secondary:
          "bg-elevated text-ink ring-1 ring-line hover:bg-panel-hover hover:ring-line-strong",
        ghost: "text-ink-muted hover:bg-elevated hover:text-ink",
        danger: "bg-danger/15 text-danger ring-1 ring-danger/30 hover:bg-danger/25",
        signal:
          "bg-signal/15 text-signal ring-1 ring-signal/25 hover:bg-signal/25",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-3.5",
        lg: "h-11 px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" /> : null}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
