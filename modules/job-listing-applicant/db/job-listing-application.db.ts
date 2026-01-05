import { and, eq } from "drizzle-orm";

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

export const updateJobListingApplication = async ({
  jobListingId,
  userId,
  rating,
}: {
  jobListingId: string;
  userId: string;
  rating: number;
}) => {
  await db
    .update(JobListingApplicationsTable)
    .set({
      rating,
    })
    .where(
      and(
        eq(JobListingApplicationsTable.jobListingId, jobListingId),
        eq(JobListingApplicationsTable.userId, userId)
      )
    );
  revalidateJobListingApplicationCache({ jobListingId, userId });
};
