import db from "@/db/db";
import { UserNotificationSettingsTable } from "@/db/schema";

import { revalidateUserNotificationSettingsCache } from "../cache/user-notification-settings";

export const insertUserNotificationSettings = async (
  settings: typeof UserNotificationSettingsTable.$inferInsert
) => {
  await db
    .insert(UserNotificationSettingsTable)
    .values(settings)
    // 如果用户已存在，则不执行任何操作
    .onConflictDoNothing();
  revalidateUserNotificationSettingsCache(settings.userId);
};
