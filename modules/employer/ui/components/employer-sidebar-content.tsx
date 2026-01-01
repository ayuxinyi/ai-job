import { ClipboardListIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

import { SidebarNavMenuGroup } from "@/components/app/sidebar/sidebar-nav-menu-group";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const navItems = [
  {
    href: "/",
    icon: <ClipboardListIcon />,
    label: "工作平台",
  },
];
export const EmployerSidebarContent = () => {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>职位列表</SidebarGroupLabel>
        <SidebarGroupAction title="增加职位" asChild>
          <Link href="/employer/job-listings/new">
            <PlusIcon />
            <span className="sr-only">增加职位</span>
          </Link>
        </SidebarGroupAction>
      </SidebarGroup>
      <SidebarNavMenuGroup className="mt-auto" items={navItems} />
    </>
  );
};
