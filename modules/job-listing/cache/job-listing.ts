import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag, getOrganizationTag } from "@/lib/data-cache";

// 缓存标签, 全局
export const getJobListingGlobalTag = () => getGlobalTag("jobListings");

// 根据jobListingId缓存
export const getJobListingIdTag = (id: string) => getIdTag("jobListings", id);

// 根据orgId缓存
export const getJobListingOrganizationTag = (organizationId: string) =>
  getOrganizationTag("jobListings", organizationId);

// 重新验证缓存
export const revalidateJobListingCache = ({
  id,
  organizationId,
}: {
  id: string;
  organizationId: string;
}) => {
  revalidateTag(getJobListingGlobalTag(), "max");
  revalidateTag(getJobListingIdTag(id), "max");
  revalidateTag(getJobListingOrganizationTag(organizationId), "max");
};
