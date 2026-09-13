import { Navigate, Route, Routes } from "react-router-dom";
import { JdPreviewPage } from "@/features/analysis/preview-page";
import { ApplicationDetailPage } from "@/features/applications/detail-page";
import { CreateApplicationPage } from "@/features/applications/create-page";
import { ApplicationsListPage } from "@/features/applications/list-page";
import { LoginPage } from "@/features/auth/login-page";
import { RegisterPage } from "@/features/auth/register-page";
import { DashboardPage } from "@/features/dashboard/dashboard-page";
import { NotificationsPage } from "@/features/notifications/notifications-page";
import { RemindersPage } from "@/features/reminders/reminders-page";
import { ResumesPage } from "@/features/resumes/resumes-page";
import { SkillsPage } from "@/features/skills/skills-page";
import { AppShell } from "@/shared/layout/app-shell";
import {
  AuthBootstrap,
  GuestRoute,
  ProtectedRoute,
} from "@/shared/layout/route-guards";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthBootstrap />}>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="/applications" element={<ApplicationsListPage />} />
            <Route path="/applications/new" element={<CreateApplicationPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/resumes" element={<ResumesPage />} />
            <Route path="/analyze" element={<JdPreviewPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
