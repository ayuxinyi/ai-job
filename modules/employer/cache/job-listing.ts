import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag, getOrganizationTag } from "@/lib/data-cache";

// 缓存标签, 全局
export const getJobListingGlobalTag = () => getGlobalTag("jobListings");

// 根据jobListingId缓存
export const getJobListingIdTag = (jobListingId: string) =>
  getIdTag("jobListings", jobListingId);

// 根据orgId缓存
export const getJobListingOrganizationTag = (orgId: string) =>
  getOrganizationTag("jobListings", orgId);

// 重新验证缓存
export const revalidateJobListingCache = ({
  jobListingId,
  orgId,
}: {
  jobListingId: string;
  orgId: string;
}) => {
  revalidateTag(getJobListingGlobalTag(), "max");
  revalidateTag(getJobListingIdTag(jobListingId), "max");
  revalidateTag(getJobListingOrganizationTag(orgId), "max");
};
