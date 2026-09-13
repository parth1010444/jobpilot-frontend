export const APPLICATION_STATUSES = [
  "SAVED",
  "APPLIED",
  "OA",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_SOURCES = [
  "LINKEDIN",
  "COMPANY_WEBSITE",
  "REFERRAL",
  "RECRUITER",
  "JOB_PORTAL",
  "OTHER",
] as const;

export type ApplicationSource = (typeof APPLICATION_SOURCES)[number];

export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "TEMPORARY",
  "OTHER",
] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export const INTERVIEW_TYPES = [
  "OA",
  "TECHNICAL",
  "SYSTEM_DESIGN",
  "MANAGERIAL",
  "HR",
  "OTHER",
] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export const INTERVIEW_STATUSES = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

export type InterviewStatus = (typeof INTERVIEW_STATUSES)[number];

export const REMINDER_TYPES = [
  "FOLLOW_UP",
  "INTERVIEW_PREPARATION",
  "INTERVIEW_FOLLOW_UP",
  "OFFER_EXPIRY",
  "CUSTOM",
] as const;

export type ReminderType = (typeof REMINDER_TYPES)[number];

export const REMINDER_STATUSES = [
  "PENDING",
  "PROCESSED",
  "CANCELLED",
] as const;

export type ReminderStatus = (typeof REMINDER_STATUSES)[number];

export const NOTIFICATION_TYPES = ["REMINDER", "SYSTEM"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const NOTIFICATION_STATUSES = [
  "PENDING",
  "SENT",
  "READ",
  "FAILED",
] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

export const RECOMMENDATION_ACTIONS = [
  "FOLLOW_UP",
  "PREPARE_FOR_INTERVIEW",
  "INTERVIEW_FOLLOW_UP",
  "REVIEW_FEEDBACK",
  "APPLY_OR_ARCHIVE",
  "EVALUATE_OFFER",
  "IMPROVE_SKILLS",
] as const;
export type RecommendationAction = (typeof RECOMMENDATION_ACTIONS)[number];

export const RECOMMENDATION_PRIORITIES = ["HIGH", "MEDIUM", "LOW"] as const;
export type RecommendationPriority = (typeof RECOMMENDATION_PRIORITIES)[number];

export const TIMELINE_BUCKETS = ["DAY", "WEEK", "MONTH"] as const;
export type TimelineBucket = (typeof TIMELINE_BUCKETS)[number];

export type ApiErrorBody = {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
};

export type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
};

export type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name?: string;
};

export type Application = {
  id: string;
  userId: string;
  company: string;
  jobTitle: string;
  jobUrl: string | null;
  location: string | null;
  employmentType: EmploymentType | null;
  source: ApplicationSource | null;
  status: ApplicationStatus;
  salaryMin: number | null;
  salaryMax: number | null;
  jobDescription: string | null;
  notes: string | null;
  appliedAt: string | null;
  resumeId: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type CreateApplicationRequest = {
  company: string;
  jobTitle: string;
  jobUrl?: string;
  location?: string;
  employmentType?: EmploymentType;
  source?: ApplicationSource;
  status?: ApplicationStatus;
  salaryMin?: number;
  salaryMax?: number;
  jobDescription?: string;
  notes?: string;
  appliedAt?: string;
  resumeId?: string;
};

export type UpdateApplicationRequest = {
  version: number;
  company?: string;
  jobTitle?: string;
  jobUrl?: string;
  location?: string;
  employmentType?: EmploymentType;
  source?: ApplicationSource;
  status?: ApplicationStatus;
  salaryMin?: number;
  salaryMax?: number;
  jobDescription?: string;
  notes?: string;
  appliedAt?: string;
  resumeId?: string | null;
};

export type Interview = {
  id: string;
  applicationId: string;
  roundNumber: number;
  type: InterviewType;
  status: InterviewStatus;
  scheduledAt: string;
  interviewer: string | null;
  meetingLink: string | null;
  notes: string | null;
  feedback: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
};

export type CreateInterviewRequest = {
  roundNumber: number;
  type: InterviewType;
  status?: InterviewStatus;
  scheduledAt: string;
  interviewer?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: string;
};

export type UpdateInterviewRequest = {
  roundNumber?: number;
  type?: InterviewType;
  status?: InterviewStatus;
  scheduledAt?: string;
  interviewer?: string;
  meetingLink?: string;
  notes?: string;
  feedback?: string;
  version?: number;
};

export type Resume = {
  id: string;
  userId: string;
  name: string;
  versionLabel: string | null;
  description: string | null;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateResumeRequest = {
  name: string;
  versionLabel?: string;
  description?: string;
  fileUrl?: string;
};

export type UpdateResumeRequest = {
  name?: string;
  versionLabel?: string;
  description?: string;
  fileUrl?: string;
};

export type Skill = {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
};

export type JobMatch = {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  requiredSkills: string[];
};

export type Recommendation = {
  action: RecommendationAction;
  priority: RecommendationPriority;
  title: string;
  reason: string;
  applicationId: string;
};

export type Reminder = {
  id: string;
  userId: string;
  applicationId: string | null;
  type: ReminderType;
  title: string;
  description: string | null;
  scheduledAt: string;
  status: ReminderStatus;
  createdAt: string;
  completedAt: string | null;
};

export type CreateReminderRequest = {
  applicationId?: string;
  type: ReminderType;
  title: string;
  description?: string;
  scheduledAt: string;
};

export type UpdateReminderRequest = {
  title?: string;
  description?: string;
  scheduledAt?: string;
  status?: ReminderStatus;
};

export type Notification = {
  id: string;
  userId: string;
  reminderId: string | null;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  createdAt: string;
  sentAt: string | null;
  retryCount: number;
};

export type StatusCount = {
  status: ApplicationStatus;
  count: number;
};

export type AnalyticsSummary = {
  totalApplications: number;
  countsByStatus: StatusCount[];
  interviewCount: number;
  offerCount: number;
  rejectedCount: number;
  averageMatchScore: number | null;
  activeApplications: number;
};

export type FunnelStage = {
  status: ApplicationStatus;
  count: number;
  conversionFromPrevious: number | null;
};

export type AnalyticsFunnel = {
  stages: FunnelStage[];
  rejectedCount: number;
  withdrawnCount: number;
};

export type TimelinePoint = {
  periodStart: string;
  applicationsCreated: number;
  applicationsApplied: number;
};

export type AnalyticsTimeline = {
  bucket: TimelineBucket;
  from: string;
  to: string;
  points: TimelinePoint[];
};

export type SkillGapItem = {
  skillName: string;
  missingCount: number;
};

export type SkillsGap = {
  missingSkills: SkillGapItem[];
};

export const STATUS_TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> =
  {
    SAVED: ["APPLIED", "WITHDRAWN"],
    APPLIED: ["OA", "INTERVIEW", "REJECTED", "WITHDRAWN"],
    OA: ["INTERVIEW", "REJECTED", "WITHDRAWN"],
    INTERVIEW: ["OFFER", "REJECTED", "WITHDRAWN"],
    OFFER: ["REJECTED", "WITHDRAWN"],
    REJECTED: [],
    WITHDRAWN: [],
  };

export function nextStatuses(current: ApplicationStatus): ApplicationStatus[] {
  return [current, ...STATUS_TRANSITIONS[current]];
}
