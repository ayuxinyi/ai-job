import { and, count, desc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

import db from "@/db/db";
import {
  type JobListing,
  JobListingApplicationsTable,
  JobListingsTable,
} from "@/db/schema";
import { getJobListingApplicationJobListingTag } from "@/modules/job-listing-applicant/cache/job-listing-applicant";

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

export const deleteJobListing = async (id: string) => {
  const [deletedJobListing] = await db
    .delete(JobListingsTable)
    .where(eq(JobListingsTable.id, id))
    .returning({
      id: JobListingsTable.id,
      organizationId: JobListingsTable.organizationId,
    });
  revalidateJobListingCache(deletedJobListing);
  return deletedJobListing;
};

export const getAllJobListings = async (orgId: string) => {
  const data = await db
    .select({
      id: JobListingsTable.id,
      title: JobListingsTable.title,
      status: JobListingsTable.status,
      // 获取申请人数
      applicationCount: count(JobListingApplicationsTable.userId),
    })
    .from(JobListingsTable)
    .where(eq(JobListingsTable.organizationId, orgId))
    .leftJoin(
      JobListingApplicationsTable,
      eq(JobListingsTable.id, JobListingApplicationsTable.jobListingId)
    )
    .groupBy(JobListingApplicationsTable.jobListingId, JobListingsTable.id)
    .orderBy(desc(JobListingsTable.createdAt));

  data.forEach(jobListing => {
    cacheTag(getJobListingApplicationJobListingTag(jobListing.id));
  });

  return data;
};

// 获取岗位详情
export const getJobListingById = async (id: string) => {
  const jobListing = await db.query.JobListingsTable.findFirst({
    where: and(
      eq(JobListingsTable.status, "published"),
      eq(JobListingsTable.id, id)
    ),
    with: {
      organization: {
        columns: {
          name: true,
          imageUrl: true,
          id: true,
        },
      },
    },
  });
  return jobListing;
};

export const getJobListingApplication = async ({
  jobListingId,
  userId,
}: {
  jobListingId: string;
  userId: string;
}) => {
  return await db.query.JobListingApplicationsTable.findFirst({
    where: and(
      eq(JobListingApplicationsTable.jobListingId, jobListingId),
      eq(JobListingApplicationsTable.userId, userId)
    ),
  });
};
