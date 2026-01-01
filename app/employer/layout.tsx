import { redirect } from "next/navigation";
import type { FC, PropsWithChildren } from "react";

import { AppSidebar } from "@/components/app/sidebar/app-sidebar";
import { EmployerSidebarContent } from "@/modules/employer/ui/components/employer-sidebar-content";
import { SidebarOrganizationButton } from "@/modules/organizations/ui/components/sidebar-organization-button";
import { getCurrentOrganization } from "@/services/clerk/actions/get-current-auth";

const EmployerLayout: FC<PropsWithChildren> = ({ children }) => {
  return <EmployerLayoutSuspense>{children}</EmployerLayoutSuspense>;
};

const EmployerLayoutSuspense: FC<PropsWithChildren> = async ({ children }) => {
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return redirect("/organizations/select");
  return (
    <AppSidebar
      content={<EmployerSidebarContent />}
      footerButton={<SidebarOrganizationButton />}
    >
      {children}
    </AppSidebar>
  );
};
export default EmployerLayout;
