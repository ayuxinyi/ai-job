import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/actions/get-current-auth";

import { updateOrganizationUserSettingsDb } from "../db/organization-user-settings";
import { OrganizationUserSettingsSchema } from "../schemas/organization-user-settings";

export const updateOrganizationUserSettings = async (
  unsafeData: OrganizationUserSettingsSchema
) => {
  const { success, data } =
    OrganizationUserSettingsSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "很抱歉，您输入的数据格式错误，请检查后重试",
    };
  }

  const { userId } = await getCurrentUser();

  if (!userId) {
    return {
      error: true,
      message: "很抱歉，您尚未登录无法更新通知设置，请先登录后重试",
    };
  }
  const { orgId } = await getCurrentOrganization();
  if (!orgId) {
    return {
      error: true,
      message: "很抱歉，您未加入任何组织无法更新通知设置，请先加入组织后重试",
    };
  }

  await updateOrganizationUserSettingsDb(
    { userId, organizationId: orgId },
    data
  );

  return {
    error: false,
    message: "通知设置更新成功",
  };
};
