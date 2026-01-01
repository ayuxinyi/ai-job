import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schema-helpers";
import { JobListingApplicationsTable } from "./job-listing-application.schema";
import { OrganizationUserSettingsTable } from "./organization-user-settings.schema";
import { UserNotificationSettingsTable } from "./user-notification-settings.schema";
import { UserResumeTable } from "./user-resume.schema";
// 用户表
export const UsersTable = pgTable("users", {
  id: varchar().primaryKey().notNull(),
  name: varchar().notNull(),
  imageUrl: varchar().notNull(),
  email: varchar().notNull().unique(),
  createdAt,
  updatedAt,
});

export const usersRelations = relations(UsersTable, ({ many, one }) => ({
  userResumes: many(UserResumeTable),
  jobListingApplications: many(JobListingApplicationsTable),
  organizationUserSettings: many(OrganizationUserSettingsTable),
  // 当我们在做一对一关系的时候，如果这张表中没有关联其它表的字段，我们可以直接使用one(表名),不需要进行关联字段的指定，但是，如果
  // 这张表中，有一个字段是关联其它表的，我们就需要指定关联字段的关系
  // userNotificationSetting:one(UserNotificationSettingsTable, {
  //   fields: [UserNotificationSettingsTable.userId],
  //   references: [UsersTable.id],
  // }),
  // })
  userNotificationSetting: one(UserNotificationSettingsTable),
}));

export type User = typeof UsersTable.$inferSelect;
