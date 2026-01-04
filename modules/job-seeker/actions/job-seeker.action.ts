import { and, desc, eq, like, or, type SQL } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import db from "@/db/db";
import { JobListingsTable } from "@/db/schema";
import { getJobListingGlobalTag } from "@/modules/job-listing/cache/job-listing";

import type { SearchSchema } from "../db/schemas/job-seeker";

export const getJobListingsBySearchParamsOrJobListingId = (
  searchParams: SearchSchema,
  jobListingId: string | undefined
) => {
  "use cache";
  cacheTag(getJobListingGlobalTag());
  cacheLife("minutes");

  const whereConditions: (SQL | undefined)[] = [];

  if (searchParams.title) {
    whereConditions.push(
      like(JobListingsTable.title, `%${searchParams.title}%`)
    );
  }

  if (searchParams.city) {
    whereConditions.push(like(JobListingsTable.city, `%${searchParams.city}%`));
  }

  if (searchParams.state) {
    whereConditions.push(
      eq(JobListingsTable.stateAbbreviation, searchParams.state)
    );
  }

  if (searchParams.experience) {
    whereConditions.push(
      eq(JobListingsTable.experienceLevel, searchParams.experience)
    );
  }

  if (searchParams.type) {
    whereConditions.push(eq(JobListingsTable.type, searchParams.type));
  }

  if (searchParams.jobIds) {
    whereConditions.push(
      or(...searchParams.jobIds.map(jobId => eq(JobListingsTable.id, jobId)))
    );
  }

  //
  return db.query.JobListingsTable.findMany({
    where: or(
      jobListingId
        ? and(
            eq(JobListingsTable.status, "published"),
            eq(JobListingsTable.id, jobListingId)
          )
        : undefined,
      and(eq(JobListingsTable.status, "published"), ...whereConditions)
    ),
    with: {
      organization: {
        columns: {
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: [
      desc(JobListingsTable.isFeatured),
      desc(JobListingsTable.postedAt),
    ],
  });
};
