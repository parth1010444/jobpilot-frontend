import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { Briefcase, Plus, Search } from "lucide-react";
import { applicationsApi } from "@/shared/api/endpoints";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/shared/api/types";
import { formatDateTime } from "@/shared/lib/dates";
import { STATUS_LABELS } from "@/shared/lib/labels";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { Input } from "@/shared/ui/input";
import { PageHeader } from "@/shared/ui/page-header";
import { Skeleton } from "@/shared/ui/skeleton";
import { StatusBadge } from "@/shared/ui/status-badge";

export function ApplicationsListPage() {
  const [params, setParams] = useSearchParams();
  const status = (params.get("status") || "") as ApplicationStatus | "";
  const qParam = params.get("q") ?? "";
  const page = Number(params.get("page") || 0);
  const [draft, setDraft] = useState(qParam);

  const query = useQuery({
    queryKey: ["applications", { q: qParam, status, page }],
    queryFn: () =>
      applicationsApi.list({
        q: qParam || undefined,
        status: status || undefined,
        page,
        size: 10,
        sort: "updatedAt,desc",
      }),
    placeholderData: keepPreviousData,
  });

  const pageLabel = useMemo(() => {
    if (!query.data) return "";
    const start = query.data.number * query.data.size + 1;
    const end = start + query.data.numberOfElements - 1;
    return query.data.totalElements === 0
      ? "0 results"
      : `${start}–${end} of ${query.data.totalElements}`;
  }, [query.data]);

  function updateParams(next: Record<string, string | number | undefined>) {
    const copy = new URLSearchParams(params);
    for (const [key, value] of Object.entries(next)) {
      if (value === undefined || value === "") copy.delete(key);
      else copy.set(key, String(value));
    }
    setParams(copy);
  }

  return (
    <div>
      <PageHeader
        title="Applications"
        description="Search, filter, and page the pipeline. Status transitions follow the backend state machine."
        actions={
          <Link
            to="/applications/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent px-3.5 text-sm font-medium text-[#0b1020]"
          >
            <Plus className="size-4" />
            New application
          </Link>
        }
      />

      <form
        className="mb-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          updateParams({ q: draft, page: 0 });
        }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-ink-faint" />
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Search company, title, location, notes"
            className="pl-9"
            aria-label="Search applications"
          />
        </div>
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>

      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip
          active={!status}
          onClick={() => updateParams({ status: undefined, page: 0 })}
        >
          All
        </FilterChip>
        {APPLICATION_STATUSES.map((item) => (
          <FilterChip
            key={item}
            active={status === item}
            onClick={() => updateParams({ status: item, page: 0 })}
          >
            {STATUS_LABELS[item]}
          </FilterChip>
        ))}
      </div>

      {query.error ? <div className="mb-4"><ErrorBanner error={query.error} /></div> : null}

      {query.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : query.data && query.data.content.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-2xl border border-line">
            <div className="hidden grid-cols-[1.3fr_1fr_140px_140px] gap-3 border-b border-line bg-panel px-4 py-2 text-[11px] uppercase tracking-wide text-ink-faint md:grid">
              <span>Role</span>
              <span>Company</span>
              <span>Status</span>
              <span>Updated</span>
            </div>
            {query.data.content.map((app) => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                className="grid gap-1 border-b border-line bg-canvas-muted/50 px-4 py-3 last:border-b-0 hover:bg-elevated md:grid-cols-[1.3fr_1fr_140px_140px] md:items-center md:gap-3"
              >
                <div>
                  <p className="font-medium">{app.jobTitle}</p>
                  <p className="text-xs text-ink-faint md:hidden">{app.company}</p>
                </div>
                <p className="hidden text-sm text-ink-muted md:block">{app.company}</p>
                <StatusBadge status={app.status} />
                <p className="text-xs text-ink-faint">{formatDateTime(app.updatedAt)}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-ink-muted">
            <p>{pageLabel}</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={query.data.first}
                onClick={() => updateParams({ page: page - 1 })}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={query.data.last}
                onClick={() => updateParams({ page: page + 1 })}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Briefcase className="size-5" />}
          title="No applications yet"
          description="Start the pipeline with a saved role. Match, interviews, and recommendations attach after you create one."
          action={
            <Link
              to="/applications/new"
              className="inline-flex h-10 items-center rounded-lg bg-accent px-3.5 text-sm font-medium text-[#0b1020]"
            >
              Create application
            </Link>
          }
        />
      )}
    </div>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1 text-xs ring-1 transition",
        active
          ? "bg-accent/15 text-ink ring-accent/40"
          : "bg-transparent text-ink-muted ring-line hover:bg-elevated",
      )}
    >
      {children}
    </button>
  );
}
