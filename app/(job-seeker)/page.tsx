import type { FC } from "react";

import { JobListingItems } from "@/modules/job-seeker/ui/components/job-listing-items";

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
}

const Home: FC<Props> = ({ searchParams }) => {
  return (
    <div className="mt-4">
      <JobListingItems searchParams={searchParams} />
    </div>
  );
};
export default Home;
