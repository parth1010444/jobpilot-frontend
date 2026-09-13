import { emitUnauthorized, useSession } from "@/shared/store/session";
import type { ApiErrorBody } from "@/shared/api/types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export class ApiClientError extends Error {
  readonly status: number;
  readonly error: string;
  readonly path?: string;
  readonly retryAfter?: number;
  readonly body?: ApiErrorBody;

  constructor(options: {
    status: number;
    message: string;
    error?: string;
    path?: string;
    retryAfter?: number;
    body?: ApiErrorBody;
  }) {
    super(options.message);
    this.name = "ApiClientError";
    this.status = options.status;
    this.error = options.error ?? "Error";
    this.path = options.path;
    this.retryAfter = options.retryAfter;
    this.body = options.body;
  }
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof ApiClientError) {
    if (error.status === 409) {
      return error.message || "This record changed. Refresh and try again.";
    }
    if (error.status === 429) {
      const wait = error.retryAfter
        ? ` Try again in ${error.retryAfter}s.`
        : "";
      return (error.message || "Too many requests.") + wait;
    }
    if (error.status === 401) {
      return error.message || "Your session expired. Please sign in again.";
    }
    return error.message || fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function parseRetryAfter(header: string | null): number | undefined {
  if (!header) return undefined;
  const seconds = Number(header);
  return Number.isFinite(seconds) ? seconds : undefined;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return typeof record.message === "string" && typeof record.status === "number";
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = useSession.getState().accessToken;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    useSession.getState().clearSession();
    emitUnauthorized();
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : undefined;

  if (!response.ok) {
    const body = isApiErrorBody(payload) ? payload : undefined;
    throw new ApiClientError({
      status: response.status,
      message: body?.message || response.statusText || "Request failed",
      error: body?.error,
      path: body?.path,
      retryAfter: parseRetryAfter(response.headers.get("Retry-After")),
      body,
    });
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string) => apiRequest<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: "POST",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    apiRequest<T>(path, {
      method: "PATCH",
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
  delete: (path: string) => apiRequest<void>(path, { method: "DELETE" }),
};

export function toSearchParams(
  values: Record<string, string | number | boolean | undefined | null>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
