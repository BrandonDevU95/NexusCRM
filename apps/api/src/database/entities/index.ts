import { OrganizationEntity } from "./organization.entity";
import { OrganizationMemberEntity } from "./organization/organization-member.entity";
import { SeedRunEntity } from "./seed-run.entity";
import { SystemSettingEntity } from "./system-setting.entity";
import { UserEntity } from "./user.entity";

export {
  OrganizationEntity,
  OrganizationMemberEntity,
  SeedRunEntity,
  SystemSettingEntity,
  UserEntity,
};

export const foundationEntities = [
  OrganizationEntity,
  SeedRunEntity,
  SystemSettingEntity,
];
