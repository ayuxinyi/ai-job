import { serve } from "inngest/next";

import { inngest } from "@/services/inngest/client";
import {
  clerkCreateUser,
  clerkDeleteUser,
  clerkUpdateUser,
} from "@/services/inngest/functions/clerk";
import {
  prepareDailyOrganizationUserApplicationNotifications,
  prepareDailyUserJobListingNotifications,
  sendDailyOrganizationUserApplicationEmail,
  sendDailyUserJobListingEmail,
} from "@/services/inngest/functions/email";
import { jobListingApplication } from "@/services/inngest/functions/job-listing-application";
import {
  clerkCreateOrganization,
  clerkCreateOrganizationMembership,
  clerkDeleteOrganization,
  clerkDeleteOrganizationMembership,
  clerkUpdateOrganization,
} from "@/services/inngest/functions/organization";
import { createAiSummaryOfUploadedResume } from "@/services/inngest/functions/resume";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkDeleteUser,
    clerkUpdateUser,
    clerkCreateOrganization,
    clerkDeleteOrganization,
    clerkUpdateOrganization,
    clerkCreateOrganizationMembership,
    clerkDeleteOrganizationMembership,
    createAiSummaryOfUploadedResume,
    jobListingApplication,
    sendDailyUserJobListingEmail,
    prepareDailyUserJobListingNotifications,
    prepareDailyOrganizationUserApplicationNotifications,
    sendDailyOrganizationUserApplicationEmail,
  ],
});
