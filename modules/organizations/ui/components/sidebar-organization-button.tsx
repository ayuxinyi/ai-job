import { LogOutIcon } from "lucide-react";
import { Suspense } from "react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SignOutButton } from "@/modules/auth/ui/components/auth-buttons";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/actions/get-current-auth";

import { SidebarOrganizationButtonClient } from "./sidebar-organization-button-client";

export const SidebarOrganizationButton = () => {
  return (
    <Suspense>
      <SidebarOrganizationSuspense />
    </Suspense>
  );
};

const SidebarOrganizationSuspense = async () => {
  const [{ user }, { organization }] = await Promise.all([
    getCurrentUser({ allData: true }),
    getCurrentOrganization({ allData: true }),
  ]);
  if (!user || !organization) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon className="mr-1" />
          <span>退出登录</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  }
  return (
    <SidebarOrganizationButtonClient user={user} organization={organization} />
  );
};
