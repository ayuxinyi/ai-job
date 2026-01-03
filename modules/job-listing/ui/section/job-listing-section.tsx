import { notFound } from "next/navigation";
import type { FC } from "react";

import {
  DeleteButton,
  EditButton,
  FeaturedToggleButton,
  StatusButton,
} from "@/components/app/auth-action-button";
import { Badge } from "@/components/ui/badge";
import { JOB_LISTING_STATUSES } from "@/constants";
import { formatJobListingBadge } from "@/lib/utils";
import { getCurrentOrganization } from "@/services/clerk/actions/get-current-auth";

import { getJobListing } from "../../actions/job-listing.action";
import { JobListingBadges } from "../components/job-listing-badges";
import { MarkdownPartial } from "../components/markdown/markdown-partial";
import { MarkdownRender } from "../components/markdown/markdown-render";

interface Props {
  params: Promise<{ jobListingId: string }>;
}

export const JobListingSection: FC<Props> = async ({ params }) => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return null;
  const { jobListingId } = await params;
  const jobListing = await getJobListing(jobListingId, orgId);
  if (!jobListing) return notFound();
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>
              {formatJobListingBadge(JOB_LISTING_STATUSES, jobListing.status)}
            </Badge>
            <JobListingBadges jobListing={jobListing} />
          </div>
        </div>
        {/* empty：当没有任何内容时，将其margin-top设置为-4，主要是为了抵消gap-4的间距 */}
        <div className="flex items-center gap-2 empty:-mt-4">
          <EditButton id={jobListingId} />
          <StatusButton status={jobListing.status} id={jobListingId} />
          {jobListing.status === "published" && (
            <FeaturedToggleButton
              id={jobListingId}
              isFeatured={jobListing.isFeatured}
            />
          )}
          <DeleteButton id={jobListingId} />
        </div>
      </div>
      <MarkdownPartial
        dialogMarkdown={<MarkdownRender source={jobListing.description} />}
        dialogTitle="岗位描述"
        mainMarkdown={
          <MarkdownRender
            className="prose-sm"
            source={jobListing.description}
          />
        }
      />
    </div>
  );
};
