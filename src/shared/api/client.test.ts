import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiClientError,
  apiRequest,
  getErrorMessage,
  toSearchParams,
} from "@/shared/api/client";
import { useSession } from "@/shared/store/session";

describe("api client", () => {
  beforeEach(() => {
    useSession.setState({
      accessToken: "tok_123",
      user: {
        id: "u1",
        email: "you@example.com",
        name: "You",
        createdAt: "2026-01-01T00:00:00Z",
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("attaches a Bearer token and returns JSON", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const data = await apiRequest<{ ok: boolean }>("/api/v1/ping");
    expect(data.ok).toBe(true);
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer tok_123");
  });

  it("surfaces backend message and handles 401 / 409 / 429", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            timestamp: "2026-09-13T00:00:00Z",
            status: 401,
            error: "Unauthorized",
            message: "Invalid token",
            path: "/api/users/me",
          }),
          { status: 401 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            timestamp: "2026-09-13T00:00:00Z",
            status: 409,
            error: "Conflict",
            message: "Stale version",
            path: "/api/applications/1",
          }),
          { status: 409 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            timestamp: "2026-09-13T00:00:00Z",
            status: 429,
            error: "Too Many Requests",
            message: "Rate limit exceeded",
            path: "/api/auth/login",
          }),
          { status: 429, headers: { "Retry-After": "12" } },
        ),
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiRequest("/api/users/me")).rejects.toMatchObject({
      status: 401,
      message: "Invalid token",
    });
    expect(useSession.getState().accessToken).toBeNull();

    useSession.setState({ accessToken: "tok_123" });
    const conflict = await apiRequest("/x").catch((e) => e);
    expect(conflict).toBeInstanceOf(ApiClientError);
    expect(getErrorMessage(conflict)).toContain("Stale version");

    const limited = await apiRequest("/y").catch((e) => e);
    expect(getErrorMessage(limited)).toContain("Rate limit exceeded");
    expect(getErrorMessage(limited)).toContain("12s");
  });

  it("builds query strings without empty values", () => {
    expect(toSearchParams({ q: "google", status: undefined, page: 0 })).toBe(
      "?q=google&page=0",
    );
  });
});
