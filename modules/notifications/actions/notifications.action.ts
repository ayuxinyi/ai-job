"use server";

import { cacheLife, cacheTag } from "next/cache";

import { getUserNotificationSettingsIdTag } from "@/modules/users/cache/user-notification-settings";
import { getCurrentUser } from "@/services/clerk/actions/get-current-auth";

import {
  getNotificationSettingsByUserId,
  updateNotificationSettingsByUserId,
} from "../db/notifications.db";
import { NotificationsFormSchema } from "../schemas/notifications.schema";

export const getNotificationSettings = async (userId: string) => {
  "use cache";
  cacheTag(getUserNotificationSettingsIdTag(userId));
  cacheLife("minutes");

  return await getNotificationSettingsByUserId(userId);
};

export const updateUserNotificationSettings = async (
  values: NotificationsFormSchema
) => {
  const { success, data } = NotificationsFormSchema.safeParse(values);

  if (!success) {
    return {
      error: true,
      message: "通知设置格式错误，请检查后重试",
    };
  }

  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: "很抱歉，您尚未登录无法更新通知设置，请登录后重试",
    };
  }

  await updateNotificationSettingsByUserId(userId, data);

  return {
    error: false,
  };
};
