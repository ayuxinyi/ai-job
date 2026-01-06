"use server";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import db from "@/db/db";
import { JobListingsTable } from "@/db/schema";
import { getJobListingGlobalTag } from "@/modules/job-listing/cache/job-listing";
import { getCurrentUser } from "@/services/clerk/actions/get-current-auth";
import { getMatchingJobListings } from "@/services/inngest/ai/get-matching-job-listings";

import { JobListingAiSearchFormSchema } from "../schemas/job-listing-ai-search-form";

export const getAiJobListingSearchResults = async (
  unsafeData: JobListingAiSearchFormSchema
) => {
  const { success, data } = JobListingAiSearchFormSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: "很抱歉，您输入的搜索内容格式错误，请检查后重试",
    };
  }

  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message: "很抱歉，您需要先登录才能使用AI智能搜索，请确保您已登录",
    };
  }

  const allListings = await getPublicJobListings();
  const matchedListings = await getMatchingJobListings(
    data.query,
    allListings,
    {
      maxNumberOfJobs: 10,
    }
  );

  if (matchedListings.length === 0) {
    return {
      error: true,
      message: "很抱歉，根据您的搜索条件，暂无符合条件的岗位",
    };
  }

  return {
    error: false,
    jobIds: matchedListings,
  };
};

const getPublicJobListings = async () => {
  "use cache";
  cacheTag(getJobListingGlobalTag());
  cacheLife("seconds");

  return db.query.JobListingsTable.findMany({
    where: eq(JobListingsTable.status, "published"),
  });
};
