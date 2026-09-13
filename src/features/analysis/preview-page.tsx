import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ScanSearch } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/api/client";
import { analysisApi } from "@/shared/api/endpoints";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { Label } from "@/shared/ui/label";
import { MatchMeter } from "@/shared/ui/match-meter";
import { PageHeader } from "@/shared/ui/page-header";
import { Textarea } from "@/shared/ui/textarea";

export function JdPreviewPage() {
  const [jobDescription, setJobDescription] = useState("");
  const preview = useMutation({
    mutationFn: () => analysisApi.preview(jobDescription),
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div>
      <PageHeader
        title="JD preview"
        description="POST /api/job-analysis/preview — extract skills and score against your profile without persisting."
      />
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Paste a description</CardTitle>
          </CardHeader>
          <CardBody>
            <Label htmlFor="jd">Job description</Label>
            <Textarea
              id="jd"
              rows={16}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Java, Spring Boot, Kafka, Postgres, Redis, Docker, Kubernetes…"
            />
            <Button
              className="mt-4"
              onClick={() => preview.mutate()}
              loading={preview.isPending}
              disabled={!jobDescription.trim()}
            >
              Preview match
            </Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardBody>
            {preview.error ? (
              <div className="mb-4">
                <ErrorBanner error={preview.error} />
              </div>
            ) : null}
            {preview.data ? (
              <div className="flex flex-col items-center gap-5">
                <MatchMeter score={preview.data.score} size={110} />
                <SkillGroup title="Required" items={preview.data.requiredSkills} tone="accent" />
                <SkillGroup title="Matched" items={preview.data.matchedSkills} tone="signal" />
                <SkillGroup title="Missing" items={preview.data.missingSkills} tone="danger" />
              </div>
            ) : (
              <EmptyState
                icon={<ScanSearch className="size-5" />}
                title="Nothing analyzed"
                description="This path never writes job_requirements. Use Analyze on an application to persist."
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function SkillGroup({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "accent" | "signal" | "danger";
}) {
  const cls =
    tone === "signal"
      ? "bg-signal/12 text-signal ring-signal/20"
      : tone === "danger"
        ? "bg-danger/12 text-danger ring-danger/20"
        : "bg-accent/12 text-accent ring-accent/20";
  return (
    <div className="w-full">
      <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-faint">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.length ? (
          items.map((item) => (
            <Badge key={item} className={cls}>
              {item}
            </Badge>
          ))
        ) : (
          <span className="text-xs text-ink-faint">None</span>
        )}
      </div>
    </div>
  );
}
