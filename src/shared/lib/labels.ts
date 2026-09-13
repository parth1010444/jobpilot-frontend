import type {
  ApplicationSource,
  ApplicationStatus,
  EmploymentType,
  InterviewStatus,
  InterviewType,
  NotificationStatus,
  RecommendationAction,
  RecommendationPriority,
  ReminderStatus,
  ReminderType,
} from "@/shared/api/types";

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  OA: "Online assessment",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const STATUS_TONES: Record<ApplicationStatus, string> = {
  SAVED: "bg-slate-500/15 text-slate-200 ring-slate-400/25",
  APPLIED: "bg-sky-500/15 text-sky-200 ring-sky-400/25",
  OA: "bg-cyan-500/15 text-cyan-200 ring-cyan-400/25",
  INTERVIEW: "bg-violet-500/15 text-violet-200 ring-violet-400/25",
  OFFER: "bg-emerald-500/15 text-emerald-200 ring-emerald-400/25",
  REJECTED: "bg-rose-500/15 text-rose-200 ring-rose-400/25",
  WITHDRAWN: "bg-zinc-500/15 text-zinc-300 ring-zinc-400/20",
};

export const SOURCE_LABELS: Record<ApplicationSource, string> = {
  LINKEDIN: "LinkedIn",
  COMPANY_WEBSITE: "Company site",
  REFERRAL: "Referral",
  RECRUITER: "Recruiter",
  JOB_PORTAL: "Job portal",
  OTHER: "Other",
};

export const EMPLOYMENT_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  TEMPORARY: "Temporary",
  OTHER: "Other",
};

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  OA: "Online assessment",
  TECHNICAL: "Technical",
  SYSTEM_DESIGN: "System design",
  MANAGERIAL: "Managerial",
  HR: "HR",
  OTHER: "Other",
};

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No-show",
};

export const REMINDER_TYPE_LABELS: Record<ReminderType, string> = {
  FOLLOW_UP: "Follow up",
  INTERVIEW_PREPARATION: "Interview prep",
  INTERVIEW_FOLLOW_UP: "Interview follow-up",
  OFFER_EXPIRY: "Offer expiry",
  CUSTOM: "Custom",
};

export const REMINDER_STATUS_LABELS: Record<ReminderStatus, string> = {
  PENDING: "Pending",
  PROCESSED: "Processed",
  CANCELLED: "Cancelled",
};

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
  PENDING: "Pending",
  SENT: "Unread",
  READ: "Read",
  FAILED: "Failed",
};

export const PRIORITY_LABELS: Record<RecommendationPriority, string> = {
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
};

export const ACTION_LABELS: Record<RecommendationAction, string> = {
  FOLLOW_UP: "Follow up",
  PREPARE_FOR_INTERVIEW: "Prepare",
  INTERVIEW_FOLLOW_UP: "Interview follow-up",
  REVIEW_FEEDBACK: "Review feedback",
  APPLY_OR_ARCHIVE: "Apply or archive",
  EVALUATE_OFFER: "Evaluate offer",
  IMPROVE_SKILLS: "Close skill gap",
};

export function titleCaseWords(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}
