import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schema-helpers";
import { JobListingsTable } from "./job-listing.schema";
import { UsersTable } from "./user.schema";

export const applicationStates = [
  "denied",
  "applied",
  "interested",
  "interviewed",
  "hired",
] as const;
export type ApplicationState = (typeof applicationStates)[number];
export const applicationStateEnum = pgEnum(
  "application_state",
  applicationStates
);

// 工作列表应用表
export const JobListingApplicationsTable = pgTable(
  "job_listing_applications",
  {
    jobListingId: uuid()
      .notNull()
      .references(() => JobListingsTable.id, { onDelete: "cascade" }),
    userId: varchar()
      .notNull()
      .references(() => UsersTable.id, { onDelete: "cascade" }),
    coverLetter: text(),
    rating: integer(),
    stage: applicationStateEnum().notNull().default("applied"),
    createdAt,
    updatedAt,
  },
  table => [
    primaryKey({
      columns: [table.jobListingId, table.userId],
      name: "job_listing_application_pkey",
    }),
  ]
);

export const jobListingApplicationsRelations = relations(
  JobListingApplicationsTable,
  ({ one }) => ({
    jobListing: one(JobListingsTable, {
      fields: [JobListingApplicationsTable.jobListingId],
      references: [JobListingsTable.id],
    }),
    user: one(UsersTable, {
      fields: [JobListingApplicationsTable.userId],
      references: [UsersTable.id],
    }),
  })
);

export type JobListingApplicationInputSchema =
  typeof JobListingApplicationsTable.$inferInsert;
export type JobListingApplicationSelectSchema =
  typeof JobListingApplicationsTable.$inferSelect;
