import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag } from "@/lib/data-cache";

export const getOrganizationUserSettingsGlobalTag = () =>
  getGlobalTag("organizationUserSettings");

export const getOrganizationUserSettingsIdTag = ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => getIdTag("organizationUserSettings", `${userId}-${organizationId}`);

export const revalidateOrganizationUserSettingsCache = ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  revalidateTag(getOrganizationUserSettingsGlobalTag(), "max");
  revalidateTag(
    getOrganizationUserSettingsIdTag({ userId, organizationId }),
    "max"
  );
};
