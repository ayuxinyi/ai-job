"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FC } from "react";

import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import type { JobListingsType } from "./job-listing-menu-group";

export const JobListingMenuItem: FC<JobListingsType> = ({
  id,
  title,
  applicationCount,
}) => {
  const { jobListingId } = useParams();

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton isActive={id === jobListingId} asChild>
        <Link href={`/employer/job-listings/${id}`}>
          <span className="truncate">{title}</span>
        </Link>
      </SidebarMenuSubButton>
      {applicationCount > 0 && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {applicationCount}
        </div>
      )}
    </SidebarMenuSubItem>
  );
};
