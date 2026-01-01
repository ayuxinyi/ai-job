import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { createdAt, id, updatedAt } from "../schema-helpers";
import { JobListingApplicationsTable } from "./job-listing-application.schema";
import { OrganizationsTable } from "./organization.schema";

// 薪资间隔枚举
export const wageIntervals = [
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
] as const;
export type WageInterval = (typeof wageIntervals)[number];
export const wageIntervalEnum = pgEnum(
  "job_listing_wage_interval",
  wageIntervals
);

// 工作地点要求枚举
export const locationRequirements = ["in-office", "hybrid", "remote"] as const;
export type locationRequirement = (typeof locationRequirements)[number];
export const locationRequirementEnum = pgEnum(
  "job_listing_location_requirement",
  locationRequirements
);

// 职业水平枚举
export const experienceLevels = ["junior", "mid-level", "senior"] as const;
export type experienceLevel = (typeof experienceLevels)[number];
export const experienceLevelEnum = pgEnum(
  "job_listing_experience_level",
  experienceLevels
);

// 工作状态枚举
export const jobListingStatuses = ["draft", "published", "delisted"] as const;
export type jobListingStatus = (typeof jobListingStatuses)[number];
export const jobListingStatusEnum = pgEnum(
  "job_listing_status",
  jobListingStatuses
);

// 工作类型枚举
export const jobListingTypes = [
  "internship",
  "part-time",
  "full-time",
] as const;
export type jobListingType = (typeof jobListingTypes)[number];
export const jobListingTypeEnum = pgEnum("job_listing_type", jobListingTypes);

// 工作列表表
export const JobListingsTable = pgTable(
  "job_listings",
  {
    id,
    organizationId: varchar()
      .notNull()
      .references(() => OrganizationsTable.id, { onDelete: "cascade" }),
    title: varchar().notNull(),
    description: varchar().notNull(),
    wage: integer(),
    wageInterval: wageIntervalEnum(),
    // 工作地点，所在州的缩写，例如 CA、NY 等
    stateAbbreviation: varchar(),
    city: varchar(),
    isFeatured: boolean().default(false).notNull(),
    locationRequirement: locationRequirementEnum().notNull(),
    experienceLevel: experienceLevelEnum().notNull(),
    status: jobListingStatusEnum().default("draft").notNull(),
    type: jobListingTypeEnum().notNull(),
    // 发布时间，带时区
    postedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
  },
  // 创建索引，加速根据 stateAbbreviation 查询工作列表的操作，这可以提高查询效率
  table => [index().on(table.stateAbbreviation)]
);

export const jobListingRelations = relations(
  JobListingsTable,
  ({ one, many }) => ({
    organization: one(OrganizationsTable, {
      fields: [JobListingsTable.organizationId],
      references: [OrganizationsTable.id],
    }),
    jobListingApplications: many(JobListingApplicationsTable),
  })
);

export type JobListing = typeof JobListingsTable.$inferInsert;

export type JobListingSelect = typeof JobListingsTable.$inferSelect;
