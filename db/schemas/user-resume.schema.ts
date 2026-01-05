import { relations } from "drizzle-orm";
import { pgTable, varchar } from "drizzle-orm/pg-core";

import { createdAt, updatedAt } from "../schema-helpers";
import { UsersTable } from "./user.schema";

// 用户简历表
export const UserResumeTable = pgTable("user_resume", {
  userId: varchar()
    .notNull()
    .primaryKey()
    .references(() => UsersTable.id, { onDelete: "cascade" }),
  resumeFileUrl: varchar().notNull(),
  resumeFileKey: varchar().notNull(),
  aiSummary: varchar(),
  createdAt,
  updatedAt,
});

export const userResumeRelations = relations(UserResumeTable, ({ one }) => ({
  user: one(UsersTable, {
    fields: [UserResumeTable.userId],
    references: [UsersTable.id],
  }),
}));

export type UserResume = typeof UserResumeTable.$inferInsert;
export type UserResumeSelect = typeof UserResumeTable.$inferSelect;
