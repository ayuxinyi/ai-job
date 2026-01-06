import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schema-helpers";
import { OrganizationsTable } from "./organization.schema";
import { UsersTable } from "./user.schema";

// 组织用户设置表
export const OrganizationUserSettingsTable = pgTable(
  "organization_user_settings",
  {
    userId: varchar()
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),
    organizationId: varchar()
      .notNull()
      .references(() => OrganizationsTable.id, { onDelete: "cascade" }),
    newApplicationEmailNotifications: boolean().notNull().default(false),
    minimumRating: integer(),
    createdAt,
    updatedAt,
  },
  table => [
    primaryKey({
      columns: [table.userId, table.organizationId],
      name: "organization_user_settings_pkey",
    }),
  ]
);

export const organizationUserSettingsRelations = relations(
  OrganizationUserSettingsTable,
  ({ one }) => ({
    user: one(UsersTable, {
      fields: [OrganizationUserSettingsTable.userId],
      references: [UsersTable.id],
    }),
    organization: one(OrganizationsTable, {
      fields: [OrganizationUserSettingsTable.organizationId],
      references: [OrganizationsTable.id],
    }),
  })
);

export type OrganizationUserSettingsInsert =
  typeof OrganizationUserSettingsTable.$inferInsert;
export type OrganizationUserSettingsSelect =
  typeof OrganizationUserSettingsTable.$inferSelect;
