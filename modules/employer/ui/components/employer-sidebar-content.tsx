import { ClipboardListIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { type FC, Suspense } from "react";

import AsyncIf from "@/components/app/async-if";
import { SidebarNavMenuGroup } from "@/components/app/sidebar/sidebar-nav-menu-group";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { hasOrgUserPermission } from "@/services/clerk/lib/org-user-permissions";

import { JobListingMenu } from "./job-listing-menu";

const navItems = [
  {
    href: "/",
    icon: <ClipboardListIcon />,
    label: "工作平台",
  },
];

interface Props {
  orgId: string;
}

export const EmployerSidebarContent: FC<Props> = ({ orgId }) => {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>职位列表</SidebarGroupLabel>
        <AsyncIf
          condition={() =>
            hasOrgUserPermission("org:job_listing:job_listings_create")
          }
        >
          <SidebarGroupAction title="增加职位" asChild>
            <Link href="/employer/job-listings/new">
              <PlusIcon />
              <span className="sr-only">增加职位</span>
            </Link>
          </SidebarGroupAction>
        </AsyncIf>
        <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
          <Suspense>
            <JobListingMenu orgId={orgId} />
          </Suspense>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarNavMenuGroup className="mt-auto" items={navItems} />
    </>
  );
};
