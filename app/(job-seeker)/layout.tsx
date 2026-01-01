import type { FC, PropsWithChildren } from "react";

import { AppSidebar } from "@/components/app/sidebar/app-sidebar";
import { HomeSidebarContent } from "@/modules/home/ui/components/home-sidebar-content";

const JobSeekerLayout: FC<PropsWithChildren> = ({ children }) => {
  return <AppSidebar content={<HomeSidebarContent />}>{children}</AppSidebar>;
};
export default JobSeekerLayout;
