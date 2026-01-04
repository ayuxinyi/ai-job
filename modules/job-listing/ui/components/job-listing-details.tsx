import { XIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type FC, Suspense } from "react";

import { UserAvatar } from "@/components/app/user-avatar";
import { Button } from "@/components/ui/button";
import { convertSearchparamsToString } from "@/modules/job-seeker/lib/utils";

import { getJobListingById } from "../../actions/job-listing.action";
import { ApplyButton } from "./apply-button";
import { JobListingBadges } from "./job-listing-badges";
import { MarkdownRender } from "./markdown/markdown-render";

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
  params: Promise<{ jobListingId: string }>;
}

export const JobListingDetails: FC<Props> = async ({
  searchParams,
  params,
}) => {
  const { jobListingId } = await params;
  const searchParamsObj = await searchParams;
  const jobListing = await getJobListingById(jobListingId);
  if (!jobListing) return notFound();

  const nameInitials = jobListing.organization.name
    .split(" ")
    .slice(0, 2)
    .map(str => str[0])
    .join("");
  return (
    <div className="space-y-6 @container">
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <UserAvatar
            imageUrl={jobListing.organization.imageUrl ?? ""}
            name={nameInitials}
            seed={jobListing.organization.name}
            variant="initials"
            size="xl"
            className="size-14"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {jobListing.title}
            </h1>
            <div className="text-base text-muted-foreground">
              {jobListing.organization.name}
            </div>
            {jobListing.postedAt != null && (
              <div className="text-sm text-muted-foreground @min-lg:hidden">
                {jobListing.postedAt.toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-4 z-40">
            {jobListing.postedAt != null && (
              <div className="text-sm text-muted-foreground @max-lg:hidden">
                {jobListing.postedAt.toLocaleDateString()}
              </div>
            )}
            <Button
              size="icon"
              variant="outline"
              asChild
              className="bg-transparent"
            >
              <Link href={`/?${convertSearchparamsToString(searchParamsObj)}`}>
                <span className="sr-only">Close</span>
                <XIcon />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <JobListingBadges jobListing={jobListing} />
        </div>
        <Suspense fallback={<Button disabled>申请岗位</Button>}>
          <ApplyButton jobListingId={jobListing.id} />
        </Suspense>
      </div>

      <MarkdownRender source={jobListing.description} />
    </div>
  );
};
