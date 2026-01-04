import Link from "next/link";
import { type FC, Suspense } from "react";

import { getJobListingsBySearchParamsOrJobListingId } from "../../actions/job-seeker.action";
import { SearchSchema } from "../../db/schemas/job-seeker";
import { convertSearchparamsToString } from "../../lib/utils";
import { JobListingItem } from "./job-listing-item";
import { JobListingsEmpty } from "./job-listings-empty";

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
  params?: Promise<{ jobListingId: string }>;
}

export const JobListingItems: FC<Props> = ({ searchParams, params }) => {
  return (
    <Suspense>
      <SuspendedComponent searchParams={searchParams} params={params} />
    </Suspense>
  );
};

const SuspendedComponent: FC<Props> = async ({ searchParams, params }) => {
  const { success, data } = SearchSchema.safeParse(await searchParams);
  const searchParamsObj = success ? data : {};
  const jobListingId = params ? (await params).jobListingId : undefined;
  const jobListings = await getJobListingsBySearchParamsOrJobListingId(
    searchParamsObj,
    jobListingId
  );
  if (jobListings.length === 0)
    return <JobListingsEmpty searchParamsObj={searchParamsObj} />;
  return (
    <div className="space-y-4">
      {jobListings.map(jobListing => (
        <Link
          key={jobListing.id}
          className="block"
          href={`/job-listings/${jobListing.id}?${convertSearchparamsToString(
            searchParamsObj
          )}`}
        >
          <JobListingItem
            jobListing={jobListing}
            organization={jobListing.organization}
          />
        </Link>
      ))}
    </div>
  );
};
