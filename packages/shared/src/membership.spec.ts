import { describe, expect, it } from "vitest";

import { membershipStatuses } from "./memberships.js";

describe("membership status catalog", () => {
  it("provides the supported membership states", () => {
    expect(membershipStatuses).toEqual(["active", "suspended", "removed"]);
  });

  it("keeps membership states unique", () => {
    expect(new Set(membershipStatuses).size).toBe(membershipStatuses.length);
  });
});
