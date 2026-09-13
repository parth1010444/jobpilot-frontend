import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/api/client";
import { notificationsApi } from "@/shared/api/endpoints";
import { formatDateTime } from "@/shared/lib/dates";
import { NOTIFICATION_STATUS_LABELS } from "@/shared/lib/labels";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { PageHeader } from "@/shared/ui/page-header";
import { Skeleton } from "@/shared/ui/skeleton";

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["notifications", 0],
    queryFn: () => notificationsApi.list(0, 40),
  });

  const markRead = useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div>
      <PageHeader
        title="Inbox"
        description="In-app notifications created when the reminder scheduler claims a due item."
      />
      {query.error ? (
        <div className="mb-4">
          <ErrorBanner error={query.error} />
        </div>
      ) : null}
      {query.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : query.data && query.data.content.length > 0 ? (
        <ul className="space-y-2">
          {query.data.content.map((item) => {
            const unread = item.status !== "READ";
            return (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-line bg-panel p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{item.title}</p>
                    <Badge
                      className={
                        unread
                          ? "bg-signal/12 text-signal ring-signal/25"
                          : "bg-elevated text-ink-muted ring-line"
                      }
                    >
                      {NOTIFICATION_STATUS_LABELS[item.status]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{item.message}</p>
                  <p className="mt-1 text-xs text-ink-faint">
                    {formatDateTime(item.createdAt)} · {item.type}
                  </p>
                </div>
                {unread ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => markRead.mutate(item.id)}
                    loading={markRead.isPending}
                  >
                    Mark read
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title="Inbox is quiet"
          description="When a pending reminder fires, it lands here as a SENT notification."
        />
      )}
    </div>
  );
}
