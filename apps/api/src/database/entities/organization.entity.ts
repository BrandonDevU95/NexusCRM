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

@Entity({ name: "organizations" })
@Index("organizations_slug_idx", ["slug"], { unique: true })
export class OrganizationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 160 })
  name!: string;

  @Column({ type: "varchar", length: 120 })
  slug!: string;

  @Column({ type: "varchar", length: 80, default: "America/Mexico_City" })
  timezone!: string;

  @Column({ type: "varchar", length: 3, default: "MXN" })
  currency!: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => OrganizationMemberEntity, (member) => member.organization)
  @JoinColumn({ name: "id", referencedColumnName: "organization_id" })
  members!: OrganizationMemberEntity[];

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
