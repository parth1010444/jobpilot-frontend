import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { APPLICATION_STATUSES } from "@/shared/api/types";
import { STATUS_LABELS } from "@/shared/lib/labels";
import { StatusBadge } from "@/shared/ui/status-badge";
import { nextStatuses } from "@/shared/api/types";

describe("StatusBadge", () => {
  it.each(APPLICATION_STATUSES)("renders a human label for %s", (status) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(STATUS_LABELS[status])).toBeInTheDocument();
  });

  it("exposes legal transitions including the current status", () => {
    expect(nextStatuses("SAVED")).toEqual(["SAVED", "APPLIED", "WITHDRAWN"]);
    expect(nextStatuses("REJECTED")).toEqual(["REJECTED"]);
  });
});
