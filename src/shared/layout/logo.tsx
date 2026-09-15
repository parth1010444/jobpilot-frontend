import { cn } from "@/shared/lib/cn";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-[#121627] ring-1 ring-line">
        <svg viewBox="0 0 24 24" className="size-5" fill="none">
          <path
            d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z"
            stroke="#8ea2ff"
            strokeWidth="1.4"
          />
          <path
            d="M12 8.2 16.2 10.5v4.8L12 17.6 7.8 15.3v-4.8L12 8.2Z"
            stroke="#5eead4"
            strokeWidth="1.1"
          />
          <circle cx="12" cy="12.8" r="1.15" fill="#5eead4" />
        </svg>
      </span>
      <span
        className={cn(
          "font-display text-[15px] font-semibold tracking-tight",
          compact && "sr-only",
        )}
      >
        JobPilot
      </span>
    </div>
  );
}
