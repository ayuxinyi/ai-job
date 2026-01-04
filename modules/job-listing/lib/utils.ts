import { JOB_LISTING_STATUS_ORDER } from "@/constants";
import type { jobListingStatus } from "@/db/schema";

export const getNextJobListingStatus = (status: jobListingStatus) => {
  switch (status) {
    case "draft":
    case "delisted":
      return "published";
    case "published":
      return "delisted";
    default:
      throw new Error(`很抱歉，${status} 不是一个有效的状态`);
  }
};

export const sortJobListingStatus = (
  a: jobListingStatus,
  b: jobListingStatus
) => {
  return JOB_LISTING_STATUS_ORDER[a] - JOB_LISTING_STATUS_ORDER[b];
};
