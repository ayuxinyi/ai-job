"use server";

import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { cacheLife } from "next/cache";
import { redirect } from "next/navigation";

import db from "@/db/db";
import { JobListingsTable } from "@/db/schema";
import { formateZodError } from "@/lib/utils";
import { getCurrentOrganization } from "@/services/clerk/actions/get-current-auth";

import { getJobListingOrganizationTag } from "../cache/job-listing";
import { insertJobListing } from "../db/job-listing";
import { JobListingSchema } from "../schemas/job-listing.schema";

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

export const createJobListing = async (unsafeData: JobListingSchema) => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId)
    return {
      error: true,
      message: "很抱歉，您没有权限创建岗位，请先绑定组织再进行操作",
    };
  const { success, data, error } = JobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: formateZodError(error).message,
    };
  }
  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });
  redirect(`/employer/job-listings/${jobListing.id}`);
};
