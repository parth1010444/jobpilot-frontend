import { api, toSearchParams } from "@/shared/api/client";
import type {
  AnalyticsFunnel,
  AnalyticsSummary,
  AnalyticsTimeline,
  Application,
  AuthResponse,
  CreateApplicationRequest,
  CreateInterviewRequest,
  CreateReminderRequest,
  CreateResumeRequest,
  Interview,
  JobMatch,
  LoginRequest,
  Notification,
  Recommendation,
  RegisterRequest,
  Reminder,
  ReminderStatus,
  Resume,
  Skill,
  SkillsGap,
  SpringPage,
  TimelineBucket,
  UpdateApplicationRequest,
  UpdateInterviewRequest,
  UpdateReminderRequest,
  UpdateResumeRequest,
  User,
  ApplicationStatus,
} from "@/shared/api/types";

export const authApi = {
  login: (body: LoginRequest) => api.post<AuthResponse>("/api/auth/login", body),
  register: (body: RegisterRequest) =>
    api.post<AuthResponse>("/api/auth/register", body),
  me: () => api.get<User>("/api/users/me"),
};

export const applicationsApi = {
  list: (params: {
    q?: string;
    status?: ApplicationStatus;
    page?: number;
    size?: number;
    sort?: string;
  }) =>
    api.get<SpringPage<Application>>(
      `/api/applications${toSearchParams(params)}`,
    ),
  get: (id: string) => api.get<Application>(`/api/applications/${id}`),
  create: (body: CreateApplicationRequest) =>
    api.post<Application>("/api/applications", body),
  update: (id: string, body: UpdateApplicationRequest) =>
    api.patch<Application>(`/api/applications/${id}`, body),
  remove: (id: string) => api.delete(`/api/applications/${id}`),
  analyze: (id: string) => api.post<JobMatch>(`/api/applications/${id}/analyze`),
  match: (id: string) => api.get<JobMatch>(`/api/applications/${id}/match`),
  recommendation: (id: string) =>
    api.get<Recommendation>(`/api/applications/${id}/recommendation`),
};

export const interviewsApi = {
  list: (applicationId: string, page = 0, size = 20) =>
    api.get<SpringPage<Interview>>(
      `/api/applications/${applicationId}/interviews${toSearchParams({ page, size })}`,
    ),
  create: (applicationId: string, body: CreateInterviewRequest) =>
    api.post<Interview>(`/api/applications/${applicationId}/interviews`, body),
  update: (id: string, body: UpdateInterviewRequest) =>
    api.patch<Interview>(`/api/interviews/${id}`, body),
  remove: (id: string) => api.delete(`/api/interviews/${id}`),
};

export const resumesApi = {
  list: () => api.get<Resume[]>("/api/resumes"),
  create: (body: CreateResumeRequest) => api.post<Resume>("/api/resumes", body),
  update: (id: string, body: UpdateResumeRequest) =>
    api.patch<Resume>(`/api/resumes/${id}`, body),
  remove: (id: string) => api.delete(`/api/resumes/${id}`),
};

export const skillsApi = {
  list: () => api.get<Skill[]>("/api/skills"),
  create: (name: string) => api.post<Skill>("/api/skills", { name }),
  remove: (id: string) => api.delete(`/api/skills/${id}`),
};

export const analysisApi = {
  preview: (jobDescription: string) =>
    api.post<JobMatch>("/api/job-analysis/preview", { jobDescription }),
};

export const recommendationsApi = {
  list: (limit = 8) =>
    api.get<Recommendation[]>(`/api/recommendations${toSearchParams({ limit })}`),
};

export const remindersApi = {
  list: (params: { status?: ReminderStatus; page?: number; size?: number }) =>
    api.get<SpringPage<Reminder>>(`/api/reminders${toSearchParams(params)}`),
  create: (body: CreateReminderRequest) =>
    api.post<Reminder>("/api/reminders", body),
  update: (id: string, body: UpdateReminderRequest) =>
    api.patch<Reminder>(`/api/reminders/${id}`, body),
  remove: (id: string) => api.delete(`/api/reminders/${id}`),
};

export const notificationsApi = {
  list: (page = 0, size = 20) =>
    api.get<SpringPage<Notification>>(
      `/api/notifications${toSearchParams({ page, size })}`,
    ),
  markRead: (id: string) =>
    api.patch<Notification>(`/api/notifications/${id}/read`),
};

export const analyticsApi = {
  summary: () => api.get<AnalyticsSummary>("/api/analytics/summary"),
  funnel: () => api.get<AnalyticsFunnel>("/api/analytics/funnel"),
  timeline: (bucket: TimelineBucket = "WEEK") =>
    api.get<AnalyticsTimeline>(
      `/api/analytics/timeline${toSearchParams({ bucket })}`,
    ),
  skillsGap: () => api.get<SkillsGap>("/api/analytics/skills-gap"),
};
