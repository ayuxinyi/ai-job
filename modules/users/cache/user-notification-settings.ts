import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag } from "@/lib/data-cache";

export function getUserNotificationSettingsGlobalTag() {
  return getGlobalTag("userNotificationSettings");
}

export function getUserNotificationSettingsIdTag(id: string) {
  return getIdTag("userNotificationSettings", id);
}

export function revalidateUserNotificationSettingsCache(id: string) {
  revalidateTag(getUserNotificationSettingsGlobalTag(), "max");
  revalidateTag(getUserNotificationSettingsIdTag(id), "max");
}
