import { AlertTriangle } from "lucide-react";
import { getErrorMessage } from "@/shared/api/client";

export function ErrorBanner({
  error,
  fallback = "Unable to load this data.",
}: {
  error: unknown;
  fallback?: string;
}) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-danger/25 bg-danger/8 px-4 py-3 text-sm text-rose-100"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" />
      <p>{getErrorMessage(error, fallback)}</p>
    </div>
  );
}
