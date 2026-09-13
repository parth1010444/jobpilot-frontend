import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlarmClock } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getErrorMessage } from "@/shared/api/client";
import { applicationsApi, remindersApi } from "@/shared/api/endpoints";
import {
  REMINDER_STATUSES,
  REMINDER_TYPES,
  type ReminderStatus,
  type ReminderType,
} from "@/shared/api/types";
import { formatDateTime, fromDateTimeLocal } from "@/shared/lib/dates";
import { REMINDER_STATUS_LABELS, REMINDER_TYPE_LABELS } from "@/shared/lib/labels";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PageHeader } from "@/shared/ui/page-header";
import { Select } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Textarea } from "@/shared/ui/textarea";

const schema = z.object({
  type: z.enum([
    "FOLLOW_UP",
    "INTERVIEW_PREPARATION",
    "INTERVIEW_FOLLOW_UP",
    "OFFER_EXPIRY",
    "CUSTOM",
  ]),
  title: z.string().min(1, "Title is required"),
  description: z.string(),
  scheduledAt: z.string().min(1, "When is required"),
  applicationId: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function RemindersPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ReminderStatus | "">("PENDING");
  const [open, setOpen] = useState(false);
  const reminders = useQuery({
    queryKey: ["reminders", status],
    queryFn: () =>
      remindersApi.list({
        status: status || undefined,
        page: 0,
        size: 50,
      }),
  });
  const applications = useQuery({
    queryKey: ["applications", { page: 0, size: 50 }],
    queryFn: () => applicationsApi.list({ page: 0, size: 50 }),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "FOLLOW_UP",
      title: "",
      description: "",
      scheduledAt: "",
      applicationId: "",
    },
  });

  const create = useMutation({
    mutationFn: (values: FormValues) =>
      remindersApi.create({
        type: values.type,
        title: values.title,
        description: values.description || undefined,
        scheduledAt: fromDateTimeLocal(values.scheduledAt) ?? new Date().toISOString(),
        applicationId:
          values.type === "CUSTOM" ? values.applicationId || undefined : values.applicationId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder scheduled");
      setOpen(false);
      form.reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const cancel = useMutation({
    mutationFn: (id: string) => remindersApi.update(id, { status: "CANCELLED" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      toast.success("Reminder cancelled");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div>
      <PageHeader
        title="Reminders"
        description="Due items are claimed by the backend scheduler and turned into in-app notifications."
        actions={
          <Button onClick={() => setOpen(true)}>
            <AlarmClock className="size-4" />
            New reminder
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={status === "" ? "secondary" : "ghost"}
          onClick={() => setStatus("")}
        >
          All
        </Button>
        {REMINDER_STATUSES.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={status === item ? "secondary" : "ghost"}
            onClick={() => setStatus(item)}
          >
            {REMINDER_STATUS_LABELS[item]}
          </Button>
        ))}
      </div>

      {reminders.error ? (
        <div className="mb-4">
          <ErrorBanner error={reminders.error} />
        </div>
      ) : null}

      {reminders.isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      ) : reminders.data && reminders.data.content.length > 0 ? (
        <ul className="space-y-2">
          {reminders.data.content.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-panel p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{item.title}</p>
                  <Badge className="bg-elevated text-ink-muted ring-line">
                    {REMINDER_TYPE_LABELS[item.type]}
                  </Badge>
                  <Badge className="bg-accent/10 text-accent ring-accent/20">
                    {REMINDER_STATUS_LABELS[item.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {item.description || "No description"}
                </p>
                <p className="mt-1 text-xs text-ink-faint">
                  Due {formatDateTime(item.scheduledAt)}
                </p>
              </div>
              {item.status === "PENDING" ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => cancel.mutate(item.id)}
                >
                  Cancel
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={<AlarmClock className="size-5" />}
          title="Nothing scheduled"
          description="Create a follow-up or interview prep reminder. Non-custom types require an application."
          action={<Button onClick={() => setOpen(true)}>Create reminder</Button>}
        />
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Schedule reminder"
        description="POST /api/reminders"
      >
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((values) => create.mutate(values))}
        >
          <Field>
            <Label htmlFor="type">Type</Label>
            <Select id="type" {...form.register("type")}>
              {REMINDER_TYPES.map((type) => (
                <option key={type} value={type}>
                  {REMINDER_TYPE_LABELS[type]}
                </option>
              ))}
            </Select>
          </Field>
          <Field error={form.formState.errors.title?.message}>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register("title")} />
          </Field>
          <Field>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...form.register("description")} />
          </Field>
          <Field error={form.formState.errors.scheduledAt?.message}>
            <Label htmlFor="scheduledAt">Due</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              {...form.register("scheduledAt")}
            />
          </Field>
          <Field>
            <Label htmlFor="applicationId">Application</Label>
            <Select id="applicationId" {...form.register("applicationId")}>
              <option value="">None (custom only)</option>
              {(applications.data?.content ?? []).map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company} · {app.jobTitle}
                </option>
              ))}
            </Select>
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button type="submit" loading={create.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

export type { ReminderType };
