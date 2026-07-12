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

  const permissionCodePattern = /^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/;

  it("keeps permissions unique and correctly formatted", () => {
    expect(new Set(basePermissions).size).toBe(basePermissions.length);

    expect(
      basePermissions.every((permission) =>
        permissionCodePattern.test(permission),
      ),
    ).toBe(true);
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

  it("keeps roles unique and includes required baseline roles", () => {
    expect(new Set(baseRoles).size).toBe(baseRoles.length);
    expect(baseRoles).toEqual(
      expect.arrayContaining([
        "Super Admin",
        "Admin",
        "Sales Manager",
        "Sales Representative",
        "Support Manager",
        "Support Agent",
        "Warehouse Manager",
        "Warehouse User",
        "Read Only",
      ]),
    );
  });
});
