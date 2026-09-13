import type { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  APPLICATION_SOURCES,
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
} from "@/shared/api/types";
import type { ApplicationFormValues } from "@/features/applications/application-form-schema";
import {
  EMPLOYMENT_LABELS,
  SOURCE_LABELS,
  STATUS_LABELS,
} from "@/shared/lib/labels";
import { Field } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

export function ApplicationFormFields({
  register,
  errors,
  resumes,
}: {
  register: UseFormRegister<ApplicationFormValues>;
  errors: FieldErrors<ApplicationFormValues>;
  resumes: { id: string; name: string; versionLabel: string | null }[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field error={errors.company?.message}>
        <Label htmlFor="company">Company</Label>
        <Input id="company" placeholder="Linear" {...register("company")} />
      </Field>
      <Field error={errors.jobTitle?.message}>
        <Label htmlFor="jobTitle">Role</Label>
        <Input id="jobTitle" placeholder="Staff Engineer" {...register("jobTitle")} />
      </Field>
      <Field className="md:col-span-2" error={errors.jobUrl?.message}>
        <Label htmlFor="jobUrl">Job URL</Label>
        <Input id="jobUrl" placeholder="https://…" {...register("jobUrl")} />
      </Field>
      <Field>
        <Label htmlFor="location">Location</Label>
        <Input id="location" placeholder="Remote / NYC" {...register("location")} />
      </Field>
      <Field>
        <Label htmlFor="employmentType">Employment type</Label>
        <Select id="employmentType" {...register("employmentType")}>
          <option value="">Select type</option>
          {EMPLOYMENT_TYPES.map((type) => (
            <option key={type} value={type}>
              {EMPLOYMENT_LABELS[type]}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Label htmlFor="source">Source</Label>
        <Select id="source" {...register("source")}>
          <option value="">Select source</option>
          {APPLICATION_SOURCES.map((source) => (
            <option key={source} value={source}>
              {SOURCE_LABELS[source]}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Label htmlFor="status">Status</Label>
        <Select id="status" {...register("status")}>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </Select>
      </Field>
      <Field>
        <Label htmlFor="salaryMin">Salary min</Label>
        <Input id="salaryMin" type="number" min={0} {...register("salaryMin")} />
      </Field>
      <Field>
        <Label htmlFor="salaryMax">Salary max</Label>
        <Input id="salaryMax" type="number" min={0} {...register("salaryMax")} />
      </Field>
      <Field>
        <Label htmlFor="appliedAt">Applied at</Label>
        <Input id="appliedAt" type="datetime-local" {...register("appliedAt")} />
      </Field>
      <Field>
        <Label htmlFor="resumeId">Resume</Label>
        <Select id="resumeId" {...register("resumeId")}>
          <option value="">None</option>
          {resumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {resume.name}
              {resume.versionLabel ? ` · ${resume.versionLabel}` : ""}
            </option>
          ))}
        </Select>
      </Field>
      <Field className="md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" rows={3} {...register("notes")} />
      </Field>
      <Field className="md:col-span-2">
        <Label htmlFor="jobDescription">Job description</Label>
        <Textarea
          id="jobDescription"
          rows={8}
          placeholder="Paste the JD to enable analyze + match."
          {...register("jobDescription")}
        />
      </Field>
    </div>
  );
}
