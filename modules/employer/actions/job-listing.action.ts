"use server";

import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { cacheLife } from "next/cache";

import db from "@/db/db";
import { JobListingsTable } from "@/db/schema";

import { getJobListingOrganizationTag } from "../cache/job-listing";

export const getMostRecantedJobListing = async (orgId: string) => {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));
  cacheLife("minutes");

  return db.query.JobListingsTable.findFirst({
    where: eq(JobListingsTable.organizationId, orgId),
    orderBy: [desc(JobListingsTable.createdAt)],
    columns: {
      id: true,
    },
  });
};
