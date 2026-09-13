import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authApi } from "@/shared/api/endpoints";
import { UNAUTHORIZED_EVENT, useSession } from "@/shared/store/session";
import { Logo } from "@/shared/layout/logo";

export function AuthBootstrap() {
  const location = useLocation();
  const accessToken = useSession((s) => s.accessToken);
  const setUser = useSession((s) => s.setUser);
  const clearSession = useSession((s) => s.clearSession);
  const [ready, setReady] = useState(!accessToken);

  useEffect(() => {
    function onUnauthorized() {
      if (!location.pathname.startsWith("/login") && !location.pathname.startsWith("/register")) {
        window.history.replaceState(null, "", "/login");
      }
    }
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [location.pathname]);

  useEffect(() => {
    if (!accessToken) {
      setReady(true);
      return;
    }
    let cancelled = false;
    authApi
      .me()
      .then((user) => {
        if (!cancelled) setUser(user);
      })
      .catch(() => {
        if (!cancelled) clearSession();
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, clearSession, setUser]);

  if (!ready) {
    return (
      <div className="surface-glow flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <div className="h-1 w-36 overflow-hidden rounded-full bg-white/8">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
          </div>
          <p className="text-sm text-ink-muted">Restoring your session…</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

export function ProtectedRoute() {
  const accessToken = useSession((s) => s.accessToken);
  const location = useLocation();
  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const accessToken = useSession((s) => s.accessToken);
  if (accessToken) return <Navigate to="/" replace />;
  return <Outlet />;
}
