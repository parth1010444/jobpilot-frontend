import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/shared/api/client";
import { interviewsApi } from "@/shared/api/endpoints";
import {
  INTERVIEW_STATUSES,
  INTERVIEW_TYPES,
  type Interview,
  type InterviewStatus,
} from "@/shared/api/types";
import { formatDateTime, fromDateTimeLocal } from "@/shared/lib/dates";
import {
  INTERVIEW_STATUS_LABELS,
  INTERVIEW_TYPE_LABELS,
} from "@/shared/lib/labels";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Textarea } from "@/shared/ui/textarea";

const schema = z.object({
  roundNumber: z.string().min(1, "Round is required"),
  type: z.enum(["OA", "TECHNICAL", "SYSTEM_DESIGN", "MANAGERIAL", "HR", "OTHER"]),
  scheduledAt: z.string().min(1, "Schedule is required"),
  interviewer: z.string(),
  meetingLink: z.string(),
  notes: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function InterviewPanel({ applicationId }: { applicationId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const list = useQuery({
    queryKey: ["interviews", applicationId],
    queryFn: () => interviewsApi.list(applicationId),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      roundNumber: "1",
      type: "TECHNICAL",
      scheduledAt: "",
      interviewer: "",
      meetingLink: "",
      notes: "",
    },
  });

  const create = useMutation({
    mutationFn: (values: FormValues) =>
      interviewsApi.create(applicationId, {
        roundNumber: Number(values.roundNumber),
        type: values.type,
        scheduledAt: fromDateTimeLocal(values.scheduledAt) ?? new Date().toISOString(),
        interviewer: values.interviewer || undefined,
        meetingLink: values.meetingLink || undefined,
        notes: values.notes || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      toast.success("Interview scheduled");
      setOpen(false);
      form.reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const patch = useMutation({
    mutationFn: ({
      interview,
      status,
    }: {
      interview: Interview;
      status: InterviewStatus;
    }) =>
      interviewsApi.update(interview.id, {
        version: interview.version,
        status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      toast.success("Interview updated");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-semibold">Interviews</h3>
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          <CalendarPlus className="size-4" />
          Add round
        </Button>
      </div>
      {list.isLoading ? (
        <Skeleton className="h-24" />
      ) : list.data && list.data.content.length > 0 ? (
        <ul className="space-y-2">
          {list.data.content.map((interview) => (
            <li
              key={interview.id}
              className="rounded-xl border border-line bg-canvas-muted/70 p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  Round {interview.roundNumber} · {INTERVIEW_TYPE_LABELS[interview.type]}
                </p>
                <Badge className="bg-violet-500/15 text-violet-100 ring-violet-400/25">
                  {INTERVIEW_STATUS_LABELS[interview.status]}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {formatDateTime(interview.scheduledAt)}
                {interview.interviewer ? ` · ${interview.interviewer}` : ""}
              </p>
              {interview.status === "SCHEDULED" ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {INTERVIEW_STATUSES.filter((status) => status !== "SCHEDULED").map(
                    (status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant="ghost"
                        onClick={() => patch.mutate({ interview, status })}
                      >
                        Mark {INTERVIEW_STATUS_LABELS[status].toLowerCase()}
                      </Button>
                    ),
                  )}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No rounds yet"
          description="Creating an interview does not change the parent application status."
          action={
            <Button size="sm" onClick={() => setOpen(true)}>
              Schedule interview
            </Button>
          }
        />
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Schedule a round"
        description="POST /api/applications/{id}/interviews"
      >
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((values) => create.mutate(values))}
        >
          <div className="grid grid-cols-2 gap-3">
            <Field error={form.formState.errors.roundNumber?.message}>
              <Label htmlFor="roundNumber">Round</Label>
              <Input
                id="roundNumber"
                type="number"
                min={1}
                {...form.register("roundNumber")}
              />
            </Field>
            <Field>
              <Label htmlFor="type">Type</Label>
              <Select id="type" {...form.register("type")}>
                {INTERVIEW_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {INTERVIEW_TYPE_LABELS[type]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field error={form.formState.errors.scheduledAt?.message}>
            <Label htmlFor="scheduledAt">Scheduled at</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              {...form.register("scheduledAt")}
            />
          </Field>
          <Field>
            <Label htmlFor="interviewer">Interviewer</Label>
            <Input id="interviewer" {...form.register("interviewer")} />
          </Field>
          <Field>
            <Label htmlFor="meetingLink">Meeting link</Label>
            <Input id="meetingLink" {...form.register("meetingLink")} />
          </Field>
          <Field>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} {...form.register("notes")} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={create.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Dialog>
    </section>
  );
}
