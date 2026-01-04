"use client";
import { ChevronRightIcon } from "lucide-react";
import { useParams } from "next/navigation";
import type { FC } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { JOB_LISTING_STATUSES } from "@/constants";
import type { JobListingSelect, jobListingStatus } from "@/db/schema";
import { formatJobListingBadge } from "@/lib/utils";

import { JobListingMenuItem } from "./job-listing-menu-item";

export type JobListingsType = Pick<
  JobListingSelect,
  "id" | "status" | "title"
> & {
  applicationCount: number;
};

interface Props {
  status: jobListingStatus;
  jobListings: JobListingsType[];
}

export const JobListingMenuGroup: FC<Props> = ({ status, jobListings }) => {
  const { jobListingId } = useParams();
  return (
    <SidebarMenu>
      <Collapsible
        defaultOpen={
          status !== "delisted" ||
          jobListings.find(job => job.id === jobListingId) !== null
        }
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              {formatJobListingBadge(JOB_LISTING_STATUSES, status)}
              <ChevronRightIcon className="size-4 ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {jobListings.map(jobListing => (
                <JobListingMenuItem key={jobListing.id} {...jobListing} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
};
