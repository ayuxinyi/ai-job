import db from "@/db/db";
import { type JobListing, JobListingsTable } from "@/db/schema";

import { revalidateJobListingCache } from "../cache/job-listing";

export const insertJobListing = async (jobListing: JobListing) => {
  const [createdJobListing] = await db
    .insert(JobListingsTable)
    .values(jobListing)
    .returning({
      id: JobListingsTable.id,
      organizationId: JobListingsTable.organizationId,
    });
  revalidateJobListingCache(createdJobListing);
  return createdJobListing;
};
