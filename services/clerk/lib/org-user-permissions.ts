import { auth } from "@clerk/nextjs/server";

type UserPermission =
  | "org:application:application_change_rating"
  | "org:application:application_change_stage"
  | "org:job_listing:job_listings_change_status"
  | "org:job_listing:job_listings_create"
  | "org:job_listing:job_listings_delete"
  | "org:job_listing:job_listings_update";

// 检查用户是否有指定权限
export const hasOrgUserPermission = async (permission: UserPermission) => {
  const { has } = await auth();
  return has({ permission });
};
