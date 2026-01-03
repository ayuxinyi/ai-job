import { and, count, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import db from "@/db/db";
import type { jobListingStatus } from "@/db/schema";
import { JobListingsTable } from "@/db/schema";
import { getCurrentOrganization } from "@/services/clerk/actions/get-current-auth";
import { hasOrgPlanFeature } from "@/services/clerk/lib/plan-features";

import { getJobListingOrganizationTag } from "../cache/job-listing";

// 检查是否已达最大发布岗位数
// 如果已达最大发布岗位数，则返回 true，否则返回 false
export const hasReachedMaxPublishedJobListings = async () => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return true;
  const count = await getJobListingsCount({
    orgId,
    status: "published",
  });
  const canPost = await Promise.all([
    hasOrgPlanFeature("post_1_job_listing").then(has => has && count < 1),
    hasOrgPlanFeature("post_3_job_listings").then(has => has && count < 3),
    hasOrgPlanFeature("post_15_job_listings").then(has => has && count < 15),
  ]);
  // canPost 中只要有一个为 true 就说明还可以发布岗位
  return !canPost.some(Boolean);
};

export const hasReachedMaxFeaturedJobListings = async () => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return true;
  const count = await getJobListingsCount({
    orgId,
    isFeatured: true,
  });
  const canFeature = await Promise.all([
    hasOrgPlanFeature("1_featured_job_listing").then(has => has && count < 1),
    hasOrgPlanFeature("unlimited_featured_job_listings"),
  ]);
  return !canFeature.some(Boolean);
};

// 获取特定要求的岗位数
const getJobListingsCount = async ({
  orgId,
  status,
  isFeatured,
}: {
  orgId: string;
  status?: jobListingStatus;
  isFeatured?: boolean;
}) => {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));
  cacheLife("minutes");

  const [res] = await db
    .select({ count: count() })
    .from(JobListingsTable)
    .where(
      and(
        eq(JobListingsTable.organizationId, orgId),
        status ? eq(JobListingsTable.status, status) : undefined,
        isFeatured ? eq(JobListingsTable.isFeatured, isFeatured) : undefined
      )
    );
  return res.count ?? 0;
};
