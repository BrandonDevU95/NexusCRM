import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { OrganizationMemberEntity } from "./organization/organization-member.entity";

@Entity({ name: "users" })
@Index("users_normalized_email_idx", ["normalizedEmail"], { unique: true })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 320 })
  email!: string;

  @Column({ name: "normalized_email", type: "varchar", length: 320 })
  normalizedEmail!: string;

  @Column({ name: "display_name", type: "varchar", length: 160 })
  displayName!: string;

  @Column({ name: "password_hash", type: "text", select: false })
  passwordHash!: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @Column({ name: "last_login_at", type: "timestamptz", nullable: true })
  lastLoginAt!: Date | null;

  @OneToMany(() => OrganizationMemberEntity, (member) => member.user)
  @JoinColumn({ name: "id", referencedColumnName: "user_id" })
  organizationMemberships!: OrganizationMemberEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
