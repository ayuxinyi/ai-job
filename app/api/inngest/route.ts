import { serve } from "inngest/next";

import { inngest } from "@/services/inngest/client";
import {
  clerkCreateUser,
  clerkDeleteUser,
  clerkUpdateUser,
} from "@/services/inngest/functions/clerk";
import { jobListingApplication } from "@/services/inngest/functions/job-listing-application";
import {
  clerkCreateOrganization,
  clerkDeleteOrganization,
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
    createAiSummaryOfUploadedResume,
    jobListingApplication,
  ],
});
