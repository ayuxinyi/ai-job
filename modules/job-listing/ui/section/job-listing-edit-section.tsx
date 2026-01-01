import { notFound } from "next/navigation";
import type { FC } from "react";

import { getCurrentOrganization } from "@/services/clerk/actions/get-current-auth";

import { getJobListing } from "../../actions/job-listing.action";
import { JobListingForm } from "../components/job-listing-form";

interface Props {
  params: Promise<{ jobListingId: string }>;
}

export const JobListingEditSection: FC<Props> = async ({ params }) => {
  const { jobListingId } = await params;
  const { orgId } = await getCurrentOrganization();
  if (!orgId || !jobListingId) return notFound();
  const jobListing = await getJobListing(jobListingId, orgId);
  if (!jobListing) return notFound();
  return (
    <div>
      <JobListingForm jobListing={jobListing} />
    </div>
  );
};
