import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import { useSession } from "@/shared/store/session";

afterEach(() => {
  cleanup();
  useSession.setState({ accessToken: null, user: null });
  localStorage.clear();
});
