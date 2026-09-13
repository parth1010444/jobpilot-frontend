import { cn } from "@/shared/lib/cn";

export function MatchMeter({
  score,
  size = 88,
}: {
  score: number;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 36;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (clamped / 100) * circ;
  const tone =
    clamped >= 70 ? "text-signal" : clamped >= 40 ? "text-warn" : "text-danger";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 88 88" className="size-full -rotate-90">
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
        />
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          className={tone}
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-display text-xl font-semibold", tone)}>
          {clamped}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-ink-faint">
          match
        </span>
      </div>
    </div>
  );
}
