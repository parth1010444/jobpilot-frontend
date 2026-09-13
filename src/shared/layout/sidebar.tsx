import { NavLink } from "react-router-dom";
import {
  Bell,
  Briefcase,
  Compass,
  FileText,
  LayoutDashboard,
  ScanSearch,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { Logo } from "@/shared/layout/logo";
import { cn } from "@/shared/lib/cn";
import { useSession } from "@/shared/store/session";

const NAV = [
  { to: "/", label: "Command", icon: LayoutDashboard, end: true },
  { to: "/applications", label: "Applications", icon: Briefcase },
  { to: "/reminders", label: "Reminders", icon: TimerReset },
  { to: "/notifications", label: "Inbox", icon: Bell },
  { to: "/skills", label: "Skills", icon: Sparkles },
  { to: "/resumes", label: "Resumes", icon: FileText },
  { to: "/analyze", label: "JD preview", icon: ScanSearch },
];

export function Sidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const user = useSession((s) => s.user);
  const initials = (user?.name || user?.email || "JP")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={cn(
        "flex h-full w-[260px] flex-col border-r border-line bg-canvas-muted/90",
        className,
      )}
    >
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-faint">
          Workspace
        </p>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-muted transition-colors",
                isActive
                  ? "bg-elevated text-ink shadow-[inset_0_0_0_1px_var(--color-line)]"
                  : "hover:bg-white/4 hover:text-ink",
              )
            }
          >
            <item.icon className="size-4 opacity-80" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.name || "Pilot"}</p>
            <p className="truncate text-xs text-ink-faint">{user?.email}</p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-ink-faint">
          <Compass className="size-3.5 text-signal" />
          Local API · Phase 12
        </p>
      </div>
    </aside>
  );
}
