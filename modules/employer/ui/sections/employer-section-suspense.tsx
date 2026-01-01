import { redirect } from "next/navigation";

import { getCurrentOrganization } from "@/services/clerk/actions/get-current-auth";

import { getMostRecantedJobListing } from "../../actions/job-listing.action";

export const EmployerSectionSuspense = async () => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return null;
  const jobListing = await getMostRecantedJobListing(orgId);
  if (!jobListing) return redirect("/employer/job-listings/new");
  return redirect(`/employer/job-listings/${jobListing.id}`);
};
