import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getErrorMessage } from "@/shared/api/client";
import { resumesApi } from "@/shared/api/endpoints";
import type { Resume } from "@/shared/api/types";
import { formatDate } from "@/shared/lib/dates";
import { Button } from "@/shared/ui/button";
import { Card, CardBody } from "@/shared/ui/card";
import { Dialog } from "@/shared/ui/dialog";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { PageHeader } from "@/shared/ui/page-header";
import { Skeleton } from "@/shared/ui/skeleton";
import { Textarea } from "@/shared/ui/textarea";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  versionLabel: z.string(),
  description: z.string(),
  fileUrl: z.string(),
});

type FormValues = z.infer<typeof schema>;

export function ResumesPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Resume | null>(null);
  const [open, setOpen] = useState(false);
  const resumes = useQuery({ queryKey: ["resumes"], queryFn: resumesApi.list });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", versionLabel: "", description: "", fileUrl: "" },
  });

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", versionLabel: "", description: "", fileUrl: "" });
    setOpen(true);
  }

  function openEdit(resume: Resume) {
    setEditing(resume);
    form.reset({
      name: resume.name,
      versionLabel: resume.versionLabel ?? "",
      description: resume.description ?? "",
      fileUrl: resume.fileUrl ?? "",
    });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: (values: FormValues) =>
      editing
        ? resumesApi.update(editing.id, {
            name: values.name,
            versionLabel: values.versionLabel || undefined,
            description: values.description || undefined,
            fileUrl: values.fileUrl || undefined,
          })
        : resumesApi.create({
            name: values.name,
            versionLabel: values.versionLabel || undefined,
            description: values.description || undefined,
            fileUrl: values.fileUrl || undefined,
          }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success(editing ? "Resume updated" : "Resume added");
      setOpen(false);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const remove = useMutation({
    mutationFn: resumesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume removed");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div>
      <PageHeader
        title="Resume library"
        description="Metadata and file URL only — JobPilot does not store the binary."
        actions={<Button onClick={openCreate}>Add resume</Button>}
      />

      {resumes.error ? (
        <div className="mb-4">
          <ErrorBanner error={resumes.error} />
        </div>
      ) : null}

      {resumes.isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : resumes.data && resumes.data.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {resumes.data.map((resume) => (
            <Card key={resume.id}>
              <CardBody>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-semibold">{resume.name}</p>
                    <p className="mt-1 text-xs text-ink-faint">
                      {resume.versionLabel || "No version label"} · updated{" "}
                      {formatDate(resume.updatedAt)}
                    </p>
                  </div>
                  <FileText className="size-4 text-accent" />
                </div>
                <p className="mt-3 text-sm text-ink-muted">
                  {resume.description || "No description"}
                </p>
                {resume.fileUrl ? (
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block break-all text-xs text-accent hover:underline"
                  >
                    {resume.fileUrl}
                  </a>
                ) : (
                  <p className="mt-3 text-xs text-ink-faint">No file URL</p>
                )}
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => openEdit(resume)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      if (confirm("Delete this resume metadata?")) remove.mutate(resume.id);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="size-5" />}
          title="No resumes"
          description="Store tailored versions with a public or private file URL, then attach them to applications."
          action={<Button onClick={openCreate}>Add resume</Button>}
        />
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit resume" : "Add resume"}
        description="Only name, version label, description, and fileUrl are sent."
      >
        <form
          className="space-y-3"
          onSubmit={form.handleSubmit((values) => save.mutate(values))}
        >
          <Field error={form.formState.errors.name?.message}>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
          </Field>
          <Field>
            <Label htmlFor="versionLabel">Version label</Label>
            <Input id="versionLabel" placeholder="V2" {...form.register("versionLabel")} />
          </Field>
          <Field>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...form.register("description")} />
          </Field>
          <Field>
            <Label htmlFor="fileUrl">File URL</Label>
            <Input
              id="fileUrl"
              placeholder="https://…"
              {...form.register("fileUrl")}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={save.isPending}>
              Save
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
