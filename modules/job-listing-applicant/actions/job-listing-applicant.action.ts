"use server";
import { getJobListingApplicationById } from "@/modules/job-listing/actions/job-listing.action";
import { getJobListingById } from "@/modules/job-listing/db/job-listing";
import { getUserResumeByUserId } from "@/modules/resume/actions/resume.action";
import { getCurrentUser } from "@/services/clerk/actions/get-current-auth";
import { inngest } from "@/services/inngest/client";

import { createJobListingApplication } from "../db/job-listing-application.db";
import { JobListingApplicationSchema } from "../schemas/job-listing-application";

export const createJobListingApplicationAction = async (
  jobListingId: string,
  unsafeDate: JobListingApplicationSchema
) => {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return {
      error: true,
      message:
        "很抱歉，未查询到您的用户信息，请检查您的登录状态，请确保您已登录",
    };
  }
  const { success, data } = JobListingApplicationSchema.safeParse(unsafeDate);
  if (!success) {
    return {
      error: true,
      message: "很抱歉，请检查您的求职信是否符合规范",
    };
  }

  const [resume, jobListing] = await Promise.all([
    getUserResumeByUserId(userId),
    getJobListingById(jobListingId),
  ]);

  if (!resume) {
    return {
      error: true,
      message: "很抱歉，未查询到您的简历信息，请检查您的简历是否已上传",
    };
  }
  if (!jobListing) {
    return {
      error: true,
      message: "很抱歉，未查询到该职位信息，请检查该职位是否存在",
    };
  }

  const jobListingApplication = await getJobListingApplicationById({
    jobListingId,
    userId,
  });

  if (jobListingApplication) {
    return {
      error: true,
      message: "很抱歉，您已经申请过该职位了，请不要重复申请",
    };
  }

  await createJobListingApplication({
    userId,
    jobListingId,
    coverLetter: data.coverLetter,
  });

  await inngest.send({
    name: "app/jobListingApplication.created",
    data: {
      jobListingId,
      userId,
    },
  });

  return {
    error: false,
    message: "恭喜您，已经成功申请该职位",
  };
};
