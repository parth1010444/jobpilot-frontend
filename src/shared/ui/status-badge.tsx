import type { ApplicationStatus } from "@/shared/api/types";
import { STATUS_LABELS, STATUS_TONES } from "@/shared/lib/labels";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/cn";

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  return (
    <Badge className={cn(STATUS_TONES[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
