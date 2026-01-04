import db from "@/db/db";
import type { JobListingApplicationInputSchema } from "@/db/schema";
import { JobListingApplicationsTable } from "@/db/schema";

import { revalidateJobListingApplicationCache } from "../cache/job-listing-applicant";

export const createJobListingApplication = async ({
  userId,
  jobListingId,
  coverLetter,
}: JobListingApplicationInputSchema) => {
  const [created] = await db
    .insert(JobListingApplicationsTable)
    .values({
      coverLetter,
      userId,
      jobListingId,
      createdAt: new Date(),
    })
    .returning({
      jobListingId: JobListingApplicationsTable.jobListingId,
      userId: JobListingApplicationsTable.userId,
    });
  revalidateJobListingApplicationCache(created);
  return created;
};
