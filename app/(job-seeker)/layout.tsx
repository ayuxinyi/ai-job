import type { FC, PropsWithChildren, ReactNode } from "react";

import { AppSidebar } from "@/components/app/sidebar/app-sidebar";
import { HomeSidebarContent } from "@/modules/home/ui/components/home-sidebar-content";

const JobSeekerLayout: FC<PropsWithChildren<{ sidebar: ReactNode }>> = ({
  children,
  sidebar,
}) => {
  return (
    <AppSidebar
      content={
        <>
          {/* 并行路由 */}
          {sidebar}
          <HomeSidebarContent />
        </>
      }
    >
      {children}
    </AppSidebar>
  );
};
export default JobSeekerLayout;
