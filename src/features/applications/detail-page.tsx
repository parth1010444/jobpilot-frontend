import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Sparkles, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { InterviewPanel } from "@/features/interviews/interview-panel";
import { ApiClientError, getErrorMessage } from "@/shared/api/client";
import { applicationsApi, resumesApi } from "@/shared/api/endpoints";
import { nextStatuses, type ApplicationStatus } from "@/shared/api/types";
import { ApplicationFormFields } from "@/features/applications/application-form-fields";
import {
  applicationFormSchema,
  type ApplicationFormValues,
} from "@/features/applications/application-form-schema";
import { fromDateTimeLocal, toDateTimeLocal } from "@/shared/lib/dates";
import { PRIORITY_LABELS, STATUS_LABELS } from "@/shared/lib/labels";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/shared/ui/card";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { MatchMeter } from "@/shared/ui/match-meter";
import { PageHeader } from "@/shared/ui/page-header";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { StatusBadge } from "@/shared/ui/status-badge";

export function ApplicationDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const appQuery = useQuery({
    queryKey: ["application", id],
    queryFn: () => applicationsApi.get(id),
    enabled: Boolean(id),
  });
  const resumes = useQuery({ queryKey: ["resumes"], queryFn: resumesApi.list });
  const match = useQuery({
    queryKey: ["match", id],
    queryFn: () => applicationsApi.match(id),
    enabled: Boolean(id),
    retry: false,
  });
  const recommendation = useQuery({
    queryKey: ["recommendation", id],
    queryFn: () => applicationsApi.recommendation(id),
    enabled: Boolean(id),
    retry: false,
  });

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      company: "",
      jobTitle: "",
      jobUrl: "",
      location: "",
      employmentType: "",
      source: "",
      status: "SAVED",
      salaryMin: "",
      salaryMax: "",
      appliedAt: "",
      resumeId: "",
      notes: "",
      jobDescription: "",
    },
  });

  useEffect(() => {
    const app = appQuery.data;
    if (!app) return;
    form.reset({
      company: app.company,
      jobTitle: app.jobTitle,
      jobUrl: app.jobUrl ?? "",
      location: app.location ?? "",
      employmentType: app.employmentType ?? "",
      source: app.source ?? "",
      status: app.status,
      salaryMin: app.salaryMin?.toString() ?? "",
      salaryMax: app.salaryMax?.toString() ?? "",
      appliedAt: toDateTimeLocal(app.appliedAt),
      resumeId: app.resumeId ?? "",
      notes: app.notes ?? "",
      jobDescription: app.jobDescription ?? "",
    });
  }, [appQuery.data, form]);

  const save = useMutation({
    mutationFn: (values: ApplicationFormValues) => {
      if (!appQuery.data) throw new Error("Application not loaded");
      const resumeChanged = (values.resumeId || null) !== (appQuery.data.resumeId || null);
      return applicationsApi.update(id, {
        version: appQuery.data.version,
        company: values.company,
        jobTitle: values.jobTitle,
        jobUrl: values.jobUrl || undefined,
        location: values.location || undefined,
        employmentType: values.employmentType || undefined,
        source: values.source || undefined,
        status: values.status,
        salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
        salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
        appliedAt: fromDateTimeLocal(values.appliedAt),
        notes: values.notes || undefined,
        jobDescription: values.jobDescription || undefined,
        ...(resumeChanged ? { resumeId: values.resumeId || null } : {}),
      });
    },
    onSuccess: (app) => {
      queryClient.setQueryData(["application", id], app);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      toast.success("Saved");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const statusPatch = useMutation({
    mutationFn: (status: ApplicationStatus) => {
      if (!appQuery.data) throw new Error("Application not loaded");
      return applicationsApi.update(id, {
        version: appQuery.data.version,
        status,
      });
    },
    onSuccess: (app) => {
      queryClient.setQueryData(["application", id], app);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["recommendation", id] });
      toast.success(`Moved to ${STATUS_LABELS[app.status]}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const analyze = useMutation({
    mutationFn: () => applicationsApi.analyze(id),
    onSuccess: (data) => {
      queryClient.setQueryData(["match", id], data);
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Analysis stored");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: () => applicationsApi.remove(id),
    onSuccess: () => {
      toast.success("Application deleted");
      navigate("/applications");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (appQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (appQuery.error || !appQuery.data) {
    return <ErrorBanner error={appQuery.error ?? new Error("Not found")} />;
  }

  const app = appQuery.data;
  const allowed = nextStatuses(app.status);

  return (
    <div>
      <PageHeader
        title={app.jobTitle}
        description={`${app.company}${app.location ? ` · ${app.location}` : ""}`}
        actions={
          <>
            {app.jobUrl ? (
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-elevated px-3 text-sm ring-1 ring-line hover:bg-panel-hover"
              >
                <ExternalLink className="size-4" />
                Job post
              </a>
            ) : null}
            <Button
              variant="danger"
              onClick={() => {
                if (confirm("Delete this application?")) remove.mutate();
              }}
              loading={remove.isPending}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <StatusBadge status={app.status} />
        <label className="flex items-center gap-2 text-sm text-ink-muted">
          Move to
          <Select
            aria-label="Change application status"
            value={app.status}
            onChange={(event) =>
              statusPatch.mutate(event.target.value as ApplicationStatus)
            }
            className="w-48"
          >
            {allowed.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </Select>
        </label>
        <span className="text-xs text-ink-faint">version {app.version}</span>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Role details</CardTitle>
          </CardHeader>
          <CardBody>
            {save.error ? (
              <div className="mb-4">
                <ErrorBanner error={save.error} />
              </div>
            ) : null}
            <form
              className="space-y-5"
              onSubmit={form.handleSubmit((values) => save.mutate(values))}
            >
              <ApplicationFormFields
                register={form.register}
                errors={form.formState.errors}
                resumes={resumes.data ?? []}
              />
              <div className="flex justify-end">
                <Button type="submit" loading={save.isPending}>
                  Save changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Match</CardTitle>
            </CardHeader>
            <CardBody>
              {match.data ? (
                <div className="flex flex-col items-center gap-4">
                  <MatchMeter score={match.data.score} />
                  <SkillLists
                    matched={match.data.matchedSkills}
                    missing={match.data.missingSkills}
                  />
                </div>
              ) : match.error instanceof ApiClientError && match.error.status === 404 ? (
                <p className="text-sm text-ink-muted">
                  No stored requirements yet. Analyze the JD to persist them.
                </p>
              ) : match.error ? (
                <ErrorBanner error={match.error} />
              ) : (
                <p className="text-sm text-ink-muted">
                  Analyze to extract required skills and score coverage.
                </p>
              )}
              <Button
                className="mt-4 w-full"
                variant="secondary"
                onClick={() => analyze.mutate()}
                loading={analyze.isPending}
              >
                <Sparkles className="size-4" />
                Analyze JD
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation</CardTitle>
            </CardHeader>
            <CardBody>
              {recommendation.data ? (
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{recommendation.data.title}</p>
                    <Badge className="bg-accent/15 text-accent ring-accent/25">
                      {PRIORITY_LABELS[recommendation.data.priority]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">
                    {recommendation.data.reason}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-ink-muted">
                  No recommendation for this application right now.
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <InterviewPanel applicationId={id} />
            </CardBody>
          </Card>

          <Link to="/applications" className="block text-sm text-ink-muted hover:text-ink">
            ← Back to applications
          </Link>
        </div>
      </div>
    </div>
  );
}

function SkillLists({
  matched,
  missing,
}: {
  matched: string[];
  missing: string[];
}) {
  return (
    <div className="grid w-full gap-3 text-left sm:grid-cols-2">
      <div>
        <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">
          Matched
        </p>
        <div className="flex flex-wrap gap-1.5">
          {matched.length ? (
            matched.map((skill) => (
              <Badge key={skill} className="bg-signal/12 text-signal ring-signal/20">
                {skill}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-ink-faint">None</span>
          )}
        </div>
      </div>
      <div>
        <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">
          Missing
        </p>
        <div className="flex flex-wrap gap-1.5">
          {missing.length ? (
            missing.map((skill) => (
              <Badge key={skill} className="bg-danger/12 text-danger ring-danger/20">
                {skill}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-ink-faint">None</span>
          )}
        </div>
      </div>
    </div>
  );
}
