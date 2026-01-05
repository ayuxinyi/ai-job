import { and, eq } from "drizzle-orm";

import db from "@/db/db";
import {
  JobListingApplicationsTable,
  JobListingsTable,
  UserResumeTable,
} from "@/db/schema";

import { applicationRankingAgent } from "../ai/application-ranking-agent";
import { inngest } from "../client";

export const jobListingApplication = inngest.createFunction(
  {
    id: "app/jobListingApplication.created",
    name: "Job Listing Application Rank",
  },
  {
    event: "app/jobListingApplication.created",
  },
  async ({ event, step }) => {
    const { jobListingId, userId } = event.data;

    const getCoverLetter = step.run("get-cover-letter", async () => {
      const application = await db.query.JobListingApplicationsTable.findFirst({
        where: and(
          eq(JobListingApplicationsTable.jobListingId, jobListingId),
          eq(JobListingApplicationsTable.userId, userId)
        ),
        columns: {
          coverLetter: true,
        },
      });
      return application?.coverLetter;
    });

    const getResume = step.run("get-resume", async () => {
      const resume = await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: {
          aiSummary: true,
        },
      });
      return resume?.aiSummary;
    });

    const getJobListing = step.run("get-job-listing", async () => {
      const jobListing = await db.query.JobListingsTable.findFirst({
        where: eq(JobListingsTable.id, jobListingId),
        columns: {
          id: true,
          city: true,
          description: true,
          experienceLevel: true,
          locationRequirement: true,
          stateAbbreviation: true,
          title: true,
          wage: true,
          wageInterval: true,
          type: true,
        },
      });
      return jobListing;
    });

    const [coverLetter, resumeSummary, jobListing] = await Promise.all([
      getCoverLetter,
      getResume,
      getJobListing,
    ]);
    if (!resumeSummary || !jobListing) return;

    await applicationRankingAgent.run(
      JSON.stringify({ coverLetter, resumeSummary, jobListingId, userId })
    );
  }
);
