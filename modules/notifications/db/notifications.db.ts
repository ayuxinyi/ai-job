import { eq } from "drizzle-orm";

import db from "@/db/db";
import type { UserNotificationSettingsInsert } from "@/db/schema";
import { UserNotificationSettingsTable } from "@/db/schema";
import { revalidateUserNotificationSettingsCache } from "@/modules/users/cache/user-notification-settings";

export const getNotificationSettingsByUserId = async (userId: string) => {
  return await db.query.UserNotificationSettingsTable.findFirst({
    where: eq(UserNotificationSettingsTable.userId, userId),
    columns: {
      newJobEmailNotifications: true,
      aiPrompt: true,
    },
  });
};

// 更新用户通知设置,如果不存在则插入
export const updateNotificationSettingsByUserId = async (
  userId: string,
  values: Partial<Omit<UserNotificationSettingsInsert, "userId">>
) => {
  await db
    .insert(UserNotificationSettingsTable)
    .values({ userId, ...values })
    .onConflictDoUpdate({
      target: UserNotificationSettingsTable.userId,
      set: values,
    });

  revalidateUserNotificationSettingsCache(userId);
};
