import { getNotificationSettings } from "@/modules/notifications/actions/notifications.action";

import { NotificationsForm } from "./notifications-form";

export const SuspendedForm = async ({ userId }: { userId: string }) => {
  const notificationSettings = await getNotificationSettings(userId);
  return <NotificationsForm notificationSettings={notificationSettings} />;
};
