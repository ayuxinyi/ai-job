import { and, count, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import db from "@/db/db";
import { JobListingsTable } from "@/db/schema";
import { getCurrentOrganization } from "@/services/clerk/actions/get-current-auth";
import { hasOrgPlanFeature } from "@/services/clerk/lib/plan-features";

import { getJobListingOrganizationTag } from "../cache/job-listing";

// 检查是否已达最大发布岗位数
// 如果已达最大发布岗位数，则返回 true，否则返回 false
export const hasReachedMaxFeaturedJobListings = async () => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return true;
  const count = await getPublishedJobListingsCount(orgId);
  const canPost = await Promise.all([
    hasOrgPlanFeature("post_1_job_listing").then(has => has && count < 1),
    hasOrgPlanFeature("post_3_job_listings").then(has => has && count < 3),
    hasOrgPlanFeature("post_15_job_listings").then(has => has && count < 15),
  ]);
  // canPost 中只要有一个为 true 就说明还可以发布岗位
  return !canPost.some(Boolean);
};

// 获取已发布岗位数
const getPublishedJobListingsCount = async (orgId: string) => {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));
  cacheLife("minutes");

  const [res] = await db
    .select({ count: count() })
    .from(JobListingsTable)
    .where(
      and(
        eq(JobListingsTable.organizationId, orgId),
        eq(JobListingsTable.status, "published")
      )
    );
  return res.count ?? 0;
};
