import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Briefcase,
  CheckCircle2,
  Percent,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { analyticsApi, recommendationsApi } from "@/shared/api/endpoints";
import { STATUS_LABELS } from "@/shared/lib/labels";
import { formatDate } from "@/shared/lib/dates";
import { Badge } from "@/shared/ui/badge";
import { Card, CardBody, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { PageHeader } from "@/shared/ui/page-header";
import { CardSkeleton, Skeleton } from "@/shared/ui/skeleton";
import { PRIORITY_LABELS } from "@/shared/lib/labels";
import type { RecommendationPriority } from "@/shared/api/types";

const PRIORITY_TONE: Record<RecommendationPriority, string> = {
  HIGH: "bg-danger/15 text-danger ring-danger/25",
  MEDIUM: "bg-warn/15 text-warn ring-warn/25",
  LOW: "bg-slate-500/15 text-slate-200 ring-slate-400/20",
};

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Briefcase;
}) {
  return (
    <Card>
      <CardBody className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-ink-faint">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
          {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
        </div>
        <span className="flex size-10 items-center justify-center rounded-xl bg-elevated text-accent ring-1 ring-line">
          <Icon className="size-4" />
        </span>
      </CardBody>
    </Card>
  );
}

export function DashboardPage() {
  const summary = useQuery({ queryKey: ["analytics", "summary"], queryFn: analyticsApi.summary });
  const funnel = useQuery({ queryKey: ["analytics", "funnel"], queryFn: analyticsApi.funnel });
  const timeline = useQuery({
    queryKey: ["analytics", "timeline", "WEEK"],
    queryFn: () => analyticsApi.timeline("WEEK"),
  });
  const gap = useQuery({ queryKey: ["analytics", "skills-gap"], queryFn: analyticsApi.skillsGap });
  const recs = useQuery({
    queryKey: ["recommendations", 6],
    queryFn: () => recommendationsApi.list(6),
  });

  const firstError =
    summary.error ?? funnel.error ?? timeline.error ?? gap.error ?? recs.error;

  return (
    <div>
      <PageHeader
        title="Command center"
        description="Live analytics from /api/analytics plus next actions from the recommendation engine."
        actions={
          <Link
            to="/applications/new"
            className="inline-flex h-10 items-center rounded-lg bg-accent px-3.5 text-sm font-medium text-[#0b1020] shadow-[0_0_0_1px_rgb(142_162_255_/_0.25)]"
          >
            Track a role
          </Link>
        }
      />

      {firstError ? <div className="mb-5"><ErrorBanner error={firstError} /></div> : null}

      {summary.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : summary.data ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active pipeline"
            value={String(summary.data.activeApplications)}
            hint={`${summary.data.totalApplications} total`}
            icon={Briefcase}
          />
          <StatCard
            label="Interviews"
            value={String(summary.data.interviewCount)}
            hint={`${summary.data.offerCount} offers`}
            icon={Users}
          />
          <StatCard
            label="Avg match"
            value={
              summary.data.averageMatchScore == null
                ? "—"
                : `${Math.round(summary.data.averageMatchScore)}`
            }
            hint="Coverage of required skills"
            icon={Percent}
          />
          <StatCard
            label="Rejected"
            value={String(summary.data.rejectedCount)}
            hint="Closed without offer"
            icon={Trophy}
          />
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="min-h-[320px]">
          <CardHeader>
            <CardTitle>Weekly motion</CardTitle>
            <p className="mt-1 text-xs text-ink-muted">
              Created vs applied · UTC week buckets
            </p>
          </CardHeader>
          <CardBody className="h-64">
            {timeline.isLoading ? (
              <Skeleton className="h-full" />
            ) : timeline.data && timeline.data.points.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeline.data.points}>
                  <defs>
                    <linearGradient id="created" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8ea2ff" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#8ea2ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="applied" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5eead4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#5eead4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis
                    dataKey="periodStart"
                    tickFormatter={(v: string) => formatDate(v)}
                    tick={{ fill: "#6b7388", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#6b7388", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#10131c",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                    }}
                    labelFormatter={(v) => formatDate(String(v))}
                  />
                  <Area
                    type="monotone"
                    dataKey="applicationsCreated"
                    name="Created"
                    stroke="#8ea2ff"
                    fill="url(#created)"
                  />
                  <Area
                    type="monotone"
                    dataKey="applicationsApplied"
                    name="Applied"
                    stroke="#5eead4"
                    fill="url(#applied)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                title="No timeline yet"
                description="Create applications to populate weekly created vs applied motion."
                action={
                  <Link to="/applications/new" className="text-sm text-accent hover:underline">
                    Add the first role
                  </Link>
                }
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funnel snapshot</CardTitle>
            <p className="mt-1 text-xs text-ink-muted">
              Current status counts, not historical reach
            </p>
          </CardHeader>
          <CardBody className="h-64">
            {funnel.isLoading ? (
              <Skeleton className="h-full" />
            ) : funnel.data ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={funnel.data.stages.map((stage) => ({
                    ...stage,
                    label: STATUS_LABELS[stage.status],
                  }))}
                  layout="vertical"
                  margin={{ left: 8, right: 8 }}
                >
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={88}
                    tick={{ fill: "#9aa3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#10131c",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 12,
                    }}
                    formatter={(value, _name, item) => {
                      const conversion = item.payload.conversionFromPrevious;
                      const extra =
                        conversion == null
                          ? ""
                          : ` · ${(conversion * 100).toFixed(0)}% from previous`;
                      return [`${value}${extra}`, "Count"];
                    }}
                  />
                  <Bar dataKey="count" fill="#8ea2ff" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <CardSkeleton />
            )}
            {funnel.data ? (
              <p className="mt-2 text-xs text-ink-faint">
                Side paths: {funnel.data.rejectedCount} rejected ·{" "}
                {funnel.data.withdrawnCount} withdrawn
              </p>
            ) : null}
          </CardBody>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex items-start justify-between">
            <div>
              <CardTitle>Next actions</CardTitle>
              <p className="mt-1 text-xs text-ink-muted">GET /api/recommendations</p>
            </div>
            <CheckCircle2 className="size-4 text-signal" />
          </CardHeader>
          <CardBody className="space-y-3">
            {recs.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : recs.data && recs.data.length > 0 ? (
              recs.data.map((item) => (
                <Link
                  key={`${item.applicationId}-${item.action}`}
                  to={`/applications/${item.applicationId}`}
                  className="block rounded-xl border border-line bg-canvas-muted/60 p-3 transition hover:border-line-strong hover:bg-elevated"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{item.title}</p>
                    <Badge className={PRIORITY_TONE[item.priority]}>
                      {PRIORITY_LABELS[item.priority]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{item.reason}</p>
                </Link>
              ))
            ) : (
              <EmptyState
                icon={<Sparkles className="size-5" />}
                title="No recommendations"
                description="The engine is quiet until applications go stale, interviews approach, or match scores drop."
                action={
                  <Link to="/applications" className="text-sm text-accent hover:underline">
                    Review pipeline
                  </Link>
                }
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills gap</CardTitle>
            <p className="mt-1 text-xs text-ink-muted">
              Missing required skills across analyzed JDs
            </p>
          </CardHeader>
          <CardBody>
            {gap.isLoading ? (
              <Skeleton className="h-40" />
            ) : gap.data && gap.data.missingSkills.length > 0 ? (
              <ul className="space-y-3">
                {gap.data.missingSkills.slice(0, 8).map((item) => {
                  const max = gap.data.missingSkills[0]?.missingCount || 1;
                  const width = Math.max(12, (item.missingCount / max) * 100);
                  return (
                    <li key={item.skillName}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="capitalize text-ink">{item.skillName}</span>
                        <span className="text-ink-faint">{item.missingCount}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-signal"
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState
                title="No gap data"
                description="Analyze a job description on an application to persist required skills."
                action={
                  <Link to="/analyze" className="text-sm text-accent hover:underline">
                    Preview a JD
                  </Link>
                }
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
