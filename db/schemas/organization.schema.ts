import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schema-helpers";
import { JobListingsTable } from "./job-listing.schema";
import { OrganizationUserSettingsTable } from "./organization-user-settings.schema";

// 组织表
export const OrganizationsTable = pgTable("organizations", {
  id: varchar().primaryKey(),
  name: varchar().notNull(),
  imageUrl: varchar(),
  createdAt,
  updatedAt,
});

export const organizationsRelations = relations(
  OrganizationsTable,
  ({ many }) => ({
    jobListings: many(JobListingsTable),
    organizationUserSettings: many(OrganizationUserSettingsTable),
  })
);

export type Organization = typeof OrganizationsTable.$inferSelect;
