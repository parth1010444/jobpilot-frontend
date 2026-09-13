import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { notificationsApi } from "@/shared/api/endpoints";
import { cn } from "@/shared/lib/cn";

export function NotificationBell() {
  const query = useQuery({
    queryKey: ["notifications", 0],
    queryFn: () => notificationsApi.list(0, 20),
    refetchInterval: 30_000,
  });

  const unread =
    query.data?.content.filter((item) => item.status !== "READ").length ?? 0;

  return (
    <Link
      to="/notifications"
      aria-label={unread ? `${unread} unread notifications` : "Notifications"}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-lg bg-elevated text-ink ring-1 ring-line hover:bg-panel-hover",
      )}
    >
      <Bell className="size-4" />
      {unread > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      ) : null}
    </Link>
  );
}
