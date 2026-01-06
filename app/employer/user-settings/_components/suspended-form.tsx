import { and, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import db from "@/db/db";
import { OrganizationUserSettingsTable } from "@/db/schema";
import { getOrganizationUserSettingsIdTag } from "@/modules/organizations/cache/organizations-user-settings";

import { NotificationsForm } from "./notifications-form";

export const SuspendedForm = async ({
  userId,
  orgId,
}: {
  userId: string;
  orgId: string;
}) => {
  const notificationSettings = await getNotificationSettings(userId, orgId);
  return <NotificationsForm notificationSettings={notificationSettings} />;
};

const getNotificationSettings = async (userId: string, orgId: string) => {
  "use cache";
  cacheTag(getOrganizationUserSettingsIdTag({ userId, organizationId: orgId }));
  cacheLife("minutes");

  return await db.query.OrganizationUserSettingsTable.findFirst({
    where: and(
      eq(OrganizationUserSettingsTable.userId, userId),
      eq(OrganizationUserSettingsTable.organizationId, orgId)
    ),
    columns: {
      newApplicationEmailNotifications: true,
      minimumRating: true,
    },
  });
};
