import { eq } from "drizzle-orm";

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

export const updateJobListing = async (
  id: string,
  jobListing: Partial<JobListing>
) => {
  const [updatedJobListing] = await db
    .update(JobListingsTable)
    .set(jobListing)
    .where(eq(JobListingsTable.id, id))
    .returning({
      id: JobListingsTable.id,
      organizationId: JobListingsTable.organizationId,
    });
  revalidateJobListingCache(updatedJobListing);
  return updatedJobListing;
};
