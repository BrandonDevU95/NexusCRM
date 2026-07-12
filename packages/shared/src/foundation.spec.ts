import { basePermissions, baseRoles } from "./permissions.js";
import { describe, expect, it } from "vitest";

import { backendModules } from "./modules.js";

describe("shared foundation catalogs", () => {
  it("keeps module names unique and includes security domains", () => {
    expect(new Set(backendModules).size).toBe(backendModules.length);
    expect(backendModules).toEqual(
      expect.arrayContaining([
        "auth",
        "authorization",
        "users",
        "organizations",
      ]),
    );
  });

  it("keeps permissions unique and resource-action scoped", () => {
    expect(new Set(basePermissions).size).toBe(basePermissions.length);
    expect(
      basePermissions.every((permission) => permission.includes(":")),
    ).toBe(true);
  });

  it("provides unique baseline roles", () => {
    expect(new Set(baseRoles).size).toBe(baseRoles.length);
    expect(baseRoles).toContain("Super Admin");
    expect(baseRoles).toContain("Read Only");
  });

  it("includes the Phase 2 security permissions", () => {
    expect(basePermissions).toEqual(
      expect.arrayContaining([
        "roles:read",
        "roles:manage",
        "permissions:read",
        "permissions:manage",
        "organizations:read",
        "organizations:update",
        "organization-members:create",
        "organization-members:read",
        "organization-members:update",
        "organization-members:remove",
        "sessions:read",
        "sessions:revoke",
      ]),
    );
  });
});
