import { LogOutIcon } from "lucide-react";
import { Suspense } from "react";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { SignOutButton } from "@/modules/auth/ui/components/auth-buttons";
import { getCurrentUser } from "@/services/clerk/actions/get-current-auth";

import { SidebarUserButtonClient } from "./sidebar-user-button-client";

export const SidebarUserButton = () => {
  return (
    <Suspense>
      <SidebarUserSuspense />
    </Suspense>
  );
};

const SidebarUserSuspense = async () => {
  const { user } = await getCurrentUser({ allData: true });
  if (!user) {
    return (
      <SignOutButton>
        <SidebarMenuButton>
          <LogOutIcon className="mr-1" />
          <span>退出登录</span>
        </SidebarMenuButton>
      </SignOutButton>
    );
  }
  return <SidebarUserButtonClient user={user} />;
};
