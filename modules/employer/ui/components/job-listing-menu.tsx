import { PlusIcon } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { jobListingStatus } from "@/db/schema";
import { getAllJobListingsByOrgId } from "@/modules/job-listing/actions/job-listing.action";
import { sortJobListingStatus } from "@/modules/job-listing/lib/utils";
import { hasOrgUserPermission } from "@/services/clerk/lib/org-user-permissions";

import { JobListingMenuGroup } from "./job-listing-menu-group";

interface Props {
  orgId: string;
}

export const JobListingMenu: FC<Props> = async ({ orgId }) => {
  const jobListings = await getAllJobListingsByOrgId(orgId);
  if (
    jobListings.length === 0 &&
    (await hasOrgUserPermission("org:job_listing:job_listings_create"))
  ) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/employer/job-listings/new">
              <PlusIcon className="size-4" />
              <span>创建您的第一个职位</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  return Object.entries(Object.groupBy(jobListings, job => job.status))
    .sort(([a], [b]) => {
      return sortJobListingStatus(a as jobListingStatus, b as jobListingStatus);
    })
    .map(([status, jobListings]) => (
      <JobListingMenuGroup
        key={status}
        status={status as jobListingStatus}
        jobListings={jobListings}
      />
    ));
};
