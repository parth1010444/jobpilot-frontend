import type { ReactNode } from "react";
import { Logo } from "@/shared/layout/logo";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="surface-glow min-h-screen lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden border-r border-line-strong bg-[#0a0d16] surface-grid lg:flex lg:flex-col lg:justify-between p-10">
        <div className="pointer-events-none absolute -left-24 top-20 size-[420px] rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 size-72 rounded-full bg-signal/10 blur-3xl" />
        <div className="relative">
          <Logo />
        </div>
        <div className="relative max-w-lg">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-signal">
            Phase 12 · Command surface
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight">
            Run the search like a product, not a spreadsheet.
          </h1>
          <p className="mt-4 text-sm leading-6 text-ink-muted">
            JobPilot is the operator console for applications, interviews, skill
            coverage, and next actions — wired to the Spring Boot API you already
            built.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-3">
            {[
              ["7", "pipeline states"],
              ["11", "backend phases"],
              ["JWT", "session"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-line-strong bg-panel px-3 py-3 shadow-[0_10px_30px_-20px_rgb(142_162_255_/_0.6)]"
              >
                <dt className="text-[11px] uppercase tracking-wide text-ink-faint">
                  {label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="relative text-xs text-ink-faint">
          Backend: localhost:8080 · UI: localhost:5173 · CORS required
        </p>
      </section>
      <section className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  );
}
