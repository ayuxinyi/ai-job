import { type FC, Suspense } from "react";

import { JobListingSection } from "@/modules/job-listing/ui/section/job-listing-section";

interface Props {
  params: Promise<{ jobListingId: string }>;
}

const JobListingPage: FC<Props> = async ({ params }) => {
  return (
    <Suspense>
      <JobListingSection params={params} />
    </Suspense>
  );
};
export default JobListingPage;
