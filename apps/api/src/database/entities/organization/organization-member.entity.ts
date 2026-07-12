import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { membershipStatuses, type MembershipStatus } from "@nexuscrm/shared";
import { OrganizationEntity } from "../organization.entity";
import { UserEntity } from "../user.entity";

@Entity({ name: "organization_members" })
@Index(
  "organization_members_organization_user_idx",
  ["organizationId", "userId"],
  { unique: true },
)
export class OrganizationMemberEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "organization_id", type: "uuid" })
  organizationId!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({
    name: "status",
    type: "enum",
    enum: membershipStatuses,
    enumName: "organization_member_status_enum",
    default: "active",
  })
  status!: MembershipStatus;

  @Column({
    name: "joined_at",
    type: "timestamptz",
    nullable: false,
    default: () => "CURRENT_TIMESTAMP",
  })
  joinedAt!: Date;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.members, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "organization_id" })
  organization!: OrganizationEntity;

  @ManyToOne(() => UserEntity, (user) => user.organizationMemberships, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
