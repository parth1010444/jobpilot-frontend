import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/shared/layout/sidebar";
import { Topbar } from "@/shared/layout/topbar";

const TITLES: Record<string, string> = {
  "/": "Command center",
  "/applications": "Applications",
  "/applications/new": "New application",
  "/reminders": "Reminders",
  "/notifications": "Inbox",
  "/skills": "Skills",
  "/resumes": "Resume library",
  "/analyze": "JD preview",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/applications/")) return "Application";
  return "JobPilot";
}

export function AppShell() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <div className="surface-glow min-h-screen lg:flex">
      <div className="hidden lg:block">
        <Sidebar className="fixed inset-y-0 left-0" />
      </div>
      {drawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <Sidebar
            onNavigate={() => setDrawerOpen(false)}
            className="relative z-10 h-full shadow-2xl"
          />
        </div>
      ) : null}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-[260px]">
        <Topbar title={titleFor(location.pathname)} onMenu={() => setDrawerOpen(true)} />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
