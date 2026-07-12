import { getMetadataArgsStorage } from "typeorm";
import { describe, expect, it } from "vitest";
import { OrganizationMemberEntity } from "./organization/organization-member.entity";
import { UserEntity } from "./user.entity";

describe("security entity metadata", () => {
  describe("UserEntity", () => {
    it("maps the global identity to the users table", () => {
      const table = getMetadataArgsStorage().tables.find(
        (candidate) => candidate.target === UserEntity,
      );

      expect(table?.name).toBe("users");
    });

    it("keeps normalized email globally unique", () => {
      const index = getMetadataArgsStorage().indices.find(
        (candidate) =>
          candidate.target === UserEntity &&
          candidate.name === "users_normalized_email_idx",
      );

      expect(index).toMatchObject({
        columns: ["normalizedEmail"],
        unique: true,
      });
    });

    it("does not select the password hash by default", () => {
      const passwordHash = getMetadataArgsStorage().columns.find(
        (candidate) =>
          candidate.target === UserEntity &&
          candidate.propertyName === "passwordHash",
      );

      expect(passwordHash?.options).toMatchObject({
        name: "password_hash",
        type: "text",
        select: false,
      });
    });
  });

  describe("OrganizationMemberEntity", () => {
    it("maps memberships to the organization_members table", () => {
      const table = getMetadataArgsStorage().tables.find(
        (candidate) => candidate.target === OrganizationMemberEntity,
      );

      expect(table?.name).toBe("organization_members");
    });

    it("keeps one membership per organization and user", () => {
      const index = getMetadataArgsStorage().indices.find(
        (candidate) =>
          candidate.target === OrganizationMemberEntity &&
          candidate.name === "organization_members_organization_user_idx",
      );

      expect(index).toMatchObject({
        columns: ["organizationId", "userId"],
        unique: true,
      });
    });

    it("uses UUID foreign-key columns and a constrained status", () => {
      const columns = getMetadataArgsStorage().columns.filter(
        (candidate) => candidate.target === OrganizationMemberEntity,
      );

      expect(
        columns.find((candidate) => candidate.propertyName === "organizationId")
          ?.options,
      ).toMatchObject({ name: "organization_id", type: "uuid" });
      expect(
        columns.find((candidate) => candidate.propertyName === "userId")
          ?.options,
      ).toMatchObject({ name: "user_id", type: "uuid" });
      expect(
        columns.find((candidate) => candidate.propertyName === "status")
          ?.options,
      ).toMatchObject({
        type: "enum",
        enumName: "organization_member_status_enum",
        default: "active",
      });
    });

    it("owns required and restrictive organization and user relations", () => {
      const relations = getMetadataArgsStorage().relations.filter(
        (candidate) => candidate.target === OrganizationMemberEntity,
      );

      expect(
        relations.find(
          (candidate) => candidate.propertyName === "organization",
        ),
      ).toMatchObject({
        relationType: "many-to-one",
        options: { nullable: false, onDelete: "RESTRICT" },
      });
      expect(
        relations.find((candidate) => candidate.propertyName === "user"),
      ).toMatchObject({
        relationType: "many-to-one",
        options: { nullable: false, onDelete: "RESTRICT" },
      });
    });

    it("reuses the explicit foreign-key columns as join columns", () => {
      const joinColumns = getMetadataArgsStorage().joinColumns.filter(
        (candidate) => candidate.target === OrganizationMemberEntity,
      );

      expect(joinColumns).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            propertyName: "organization",
            name: "organization_id",
          }),
          expect.objectContaining({
            propertyName: "user",
            name: "user_id",
          }),
        ]),
      );
    });
  });
});
