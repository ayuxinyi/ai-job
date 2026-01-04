import { type FC, Suspense, useMemo } from "react";

import { UserAvatar } from "@/components/app/user-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { JobListingSelect, Organization } from "@/db/schema";
import { cn } from "@/lib/utils";
import { JobListingBadges } from "@/modules/job-listing/ui/components/job-listing-badges";

import { DaysSincePosting } from "./days-since-posting";

interface Props {
  jobListing: JobListingSelect;
  organization: Pick<Organization, "name" | "imageUrl">;
}

export const JobListingItem: FC<Props> = ({ jobListing, organization }) => {
  const nameInitials = useMemo(
    () =>
      organization.name
        .split(" ")
        .slice(0, 2)
        .map(str => str[0])
        .join(""),
    [organization.name]
  );
  return (
    <Card
      className={cn(
        "@container",
        jobListing.isFeatured && "border-featured bg-featured/20"
      )}
    >
      <CardHeader className="flex gap-4">
        <UserAvatar
          imageUrl={organization.imageUrl ?? ""}
          name={nameInitials}
          seed={organization.name}
          variant="initials"
          size="xl"
        />
        <div className="flex flex-col gap-1">
          <CardTitle className="text-xl">{jobListing.title}</CardTitle>
          <CardDescription className="text-base">
            {organization.name}
          </CardDescription>
          {jobListing.postedAt && (
            <div className="text-sm font-medium text-primary @min-md:hidden">
              <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                <DaysSincePosting postedAt={jobListing.postedAt} />
              </Suspense>
            </div>
          )}
        </div>
        {jobListing.postedAt && (
          <div className="text-sm font-medium text-primary ml-auto @max-md:hidden">
            <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
              <DaysSincePosting postedAt={jobListing.postedAt} />
            </Suspense>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <JobListingBadges
          jobListing={jobListing}
          className={cn(jobListing.isFeatured && "border-primary/35")}
        />
      </CardContent>
    </Card>
  );
};
