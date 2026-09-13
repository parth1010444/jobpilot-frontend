import { LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/features/notifications/notification-bell";
import { useSession } from "@/shared/store/session";
import { Button } from "@/shared/ui/button";

export function Topbar({
  title,
  onMenu,
}: {
  title: string;
  onMenu: () => void;
}) {
  const navigate = useNavigate();
  const clearSession = useSession((s) => s.clearSession);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          onClick={onMenu}
        >
          <Menu className="size-5" />
        </Button>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            JobPilot
          </p>
          <p className="truncate font-display text-sm font-semibold">{title}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            clearSession();
            navigate("/login");
          }}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
