"use server";

import { and, desc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { cacheLife } from "next/cache";
import { redirect } from "next/navigation";

import db from "@/db/db";
import { JobListingsTable } from "@/db/schema";
import { formateZodError } from "@/lib/utils";
import { getCurrentOrganization } from "@/services/clerk/actions/get-current-auth";
import { hasOrgUserPermission } from "@/services/clerk/lib/org-user-permissions";

import {
  getJobListingIdTag,
  getJobListingOrganizationTag,
} from "../cache/job-listing";
import {
  insertJobListing,
  updateJobListing as updateJobListingDb,
  deleteJobListing as deleteJobListingDb,
} from "../db/job-listing";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "../lib/plan-feature-helper";
import { getNextJobListingStatus } from "../lib/utils";
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
  if (
    !orgId ||
    !(await hasOrgUserPermission("org:job_listing:job_listings_create"))
  )
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

export const getJobListing = async (jobListingId: string, orgId: string) => {
  "use cache";
  cacheTag(getJobListingIdTag(jobListingId));
  cacheLife("minutes");
  return db.query.JobListingsTable.findFirst({
    where: and(
      eq(JobListingsTable.id, jobListingId),
      eq(JobListingsTable.organizationId, orgId)
    ),
  });
};

export const updateJobListing = async (
  id: string,
  unsafeData: JobListingSchema
) => {
  const { orgId } = await getCurrentOrganization();
  if (
    !orgId ||
    !(await hasOrgUserPermission("org:job_listing:job_listings_update"))
  )
    return {
      error: true,
      message: "很抱歉，您没有权限更新岗位，请先绑定组织再进行操作",
    };
  const { success, data, error } = JobListingSchema.safeParse(unsafeData);
  if (!success) {
    return {
      error: true,
      message: formateZodError(error).message,
    };
  }

  const jobListing = await getJobListing(id, orgId);
  if (!jobListing) {
    return {
      error: true,
      message: "很抱歉，岗位不存在，请检查岗位ID是否正确",
    };
  }
  const updatedJobListing = await updateJobListingDb(id, data);
  redirect(`/employer/job-listings/${updatedJobListing.id}`);
};

export const toggleJobListingStatus = async (id: string) => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) {
    return {
      error: true,
      message: "很抱歉，您没有权限修改岗位状态，请先绑定组织再进行操作",
    };
  }
  const jobListing = await getJobListing(id, orgId);
  if (!jobListing) {
    return {
      error: true,
      message: "很抱歉，岗位不存在，请检查岗位ID是否正确",
    };
  }

  if (
    !(await hasOrgUserPermission("org:job_listing:job_listings_change_status"))
  ) {
    return {
      error: true,
      message:
        "很抱歉，您当前没有权限修改岗位状态，请升级您的套餐或者联系组织管理员",
    };
  }
  const newStatus = getNextJobListingStatus(jobListing.status);
  if (
    newStatus === "published" &&
    (await hasReachedMaxPublishedJobListings())
  ) {
    return {
      error: true,
      message:
        "很抱歉，您当前可以发布的岗位数已达上限，请升级您的套餐或下架已发布的岗位后再进行操作",
    };
  }
  await updateJobListingDb(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt === null
        ? new Date()
        : undefined,
  });
  return {
    error: false,
  };
};

export const toggleJobListingFeatured = async (id: string) => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) {
    return {
      error: true,
      message: "很抱歉，您没有权限更改岗位的精选状态，请先绑定组织再进行操作",
    };
  }
  const jobListing = await getJobListing(id, orgId);
  if (!jobListing) {
    return {
      error: true,
      message: "很抱歉，岗位不存在，请检查岗位ID是否正确",
    };
  }

  if (
    !(await hasOrgUserPermission("org:job_listing:job_listings_change_status"))
  ) {
    return {
      error: true,
      message:
        "很抱歉，您当前没有权限修改岗位精选状态，请升级您的套餐或者联系组织管理员",
    };
  }
  const newFeatured = !jobListing.isFeatured;
  if (newFeatured && (await hasReachedMaxFeaturedJobListings())) {
    return {
      error: true,
      message:
        "很抱歉，您当前可以精选的岗位数已达上限，请升级您的套餐或取消已精选的岗位后再进行操作",
    };
  }
  await updateJobListingDb(id, {
    isFeatured: newFeatured,
  });
  return {
    error: false,
  };
};

export const deleteJobListing = async (id: string) => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) {
    return {
      error: true,
      message: "很抱歉，您没有权限删除岗位，请先绑定组织再进行操作",
    };
  }
  const jobListing = await getJobListing(id, orgId);
  if (!jobListing) {
    return {
      error: true,
      message: "很抱歉，岗位不存在，请检查岗位ID是否正确",
    };
  }
  if (!(await hasOrgUserPermission("org:job_listing:job_listings_delete"))) {
    return {
      error: true,
      message:
        "很抱歉，您当前没有权限删除岗位，请升级您的套餐或者联系组织管理员",
    };
  }
  await deleteJobListingDb(id);
  redirect("/employer");
};
