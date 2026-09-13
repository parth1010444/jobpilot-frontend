import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getErrorMessage } from "@/shared/api/client";
import { applicationsApi, resumesApi } from "@/shared/api/endpoints";
import { ApplicationFormFields } from "@/features/applications/application-form-fields";
import {
  applicationFormSchema,
  type ApplicationFormValues,
} from "@/features/applications/application-form-schema";
import { fromDateTimeLocal } from "@/shared/lib/dates";
import { Button } from "@/shared/ui/button";
import { Card, CardBody } from "@/shared/ui/card";
import { ErrorBanner } from "@/shared/ui/error-banner";
import { PageHeader } from "@/shared/ui/page-header";

export function CreateApplicationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resumes = useQuery({ queryKey: ["resumes"], queryFn: resumesApi.list });

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

  const mutation = useMutation({
    mutationFn: applicationsApi.create,
    onSuccess: (app) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
      toast.success("Application created");
      navigate(`/applications/${app.id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div>
      <PageHeader
        title="New application"
        description="POST /api/applications. Status defaults to SAVED if you leave it there."
        actions={
          <Link to="/applications" className="text-sm text-ink-muted hover:text-ink">
            Back to list
          </Link>
        }
      />
      <Card>
        <CardBody>
          {mutation.error ? (
            <div className="mb-4">
              <ErrorBanner error={mutation.error} />
            </div>
          ) : null}
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit((values) => {
              mutation.mutate({
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
                resumeId: values.resumeId || undefined,
                notes: values.notes || undefined,
                jobDescription: values.jobDescription || undefined,
              });
            })}
          >
            <ApplicationFormFields
              register={form.register}
              errors={form.formState.errors}
              resumes={resumes.data ?? []}
            />
            <div className="flex justify-end gap-2">
              <Link
                to="/applications"
                className="inline-flex h-10 items-center rounded-lg px-3 text-sm text-ink-muted hover:text-ink"
              >
                Cancel
              </Link>
              <Button type="submit" loading={mutation.isPending}>
                Create application
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
