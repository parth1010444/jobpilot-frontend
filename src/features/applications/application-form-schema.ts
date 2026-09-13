import { z } from "zod";
import {
  APPLICATION_SOURCES,
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
} from "@/shared/api/types";

export const applicationFormSchema = z.object({
  company: z.string().min(1, "Company is required"),
  jobTitle: z.string().min(1, "Role is required"),
  jobUrl: z.string(),
  location: z.string(),
  employmentType: z.union([z.literal(""), z.enum(EMPLOYMENT_TYPES)]),
  source: z.union([z.literal(""), z.enum(APPLICATION_SOURCES)]),
  status: z.enum(APPLICATION_STATUSES),
  salaryMin: z.string(),
  salaryMax: z.string(),
  appliedAt: z.string(),
  resumeId: z.string(),
  notes: z.string(),
  jobDescription: z.string(),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
