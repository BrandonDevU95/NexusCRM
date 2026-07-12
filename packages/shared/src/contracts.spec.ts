import type {
  AuthenticatedActor,
  OrganizationContext,
  PaginatedResult,
  PaginationParams,
} from "./index.js";
import { describe, expectTypeOf, it } from "vitest";

describe("shared security contracts", () => {
  it("defines the authenticated request context", () => {
    expectTypeOf<AuthenticatedActor>().toEqualTypeOf<{
      readonly userId: string;
      readonly sessionId: string;
    }>();

    expectTypeOf<OrganizationContext>().toEqualTypeOf<{
      readonly organizationId: string;
      readonly membershipId: string;
    }>();
  });

  it("defines reusable pagination contracts", () => {
    expectTypeOf<PaginationParams>().toEqualTypeOf<{
      readonly page: number;
      readonly pageSize: number;
      readonly search?: string;
    }>();

    expectTypeOf<PaginatedResult<{ id: string }>>().toEqualTypeOf<{
      readonly items: { id: string }[];
      readonly meta: {
        readonly page: number;
        readonly pageSize: number;
        readonly totalItems: number;
        readonly totalPages: number;
      };
    }>();
  });
});
