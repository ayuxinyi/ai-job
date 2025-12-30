import { relations } from "drizzle-orm";
import { boolean, pgTable, varchar } from "drizzle-orm/pg-core";

import { createdAt, updatedAt, userId } from "../schema-helpers";
import { UsersTable } from "./user.schema";

// 用户通知设置表
export const UserNotificationSettingsTable = pgTable(
  "user_notification_settings",
  {
    userId,
    newJobEmailNotifications: boolean().notNull().default(false),
    aiPrompt: varchar(),
    createdAt,
    updatedAt,
  }
);

export const userNotificationSettingsRelations = relations(
  UserNotificationSettingsTable,
  ({ one }) => ({
    // 在这里做一对一关系的时候，我们就需要指定关联字段了，因为这张表中，userId是关联UsersTable的字段
    user: one(UsersTable, {
      fields: [UserNotificationSettingsTable.userId],
      references: [UsersTable.id],
    }),
  })
);
