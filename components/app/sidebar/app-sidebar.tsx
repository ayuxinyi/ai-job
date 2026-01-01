import type { FC } from "react";

import { ResponsiveSidebar } from "@/components/app/sidebar/responsive-sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn } from "@/modules/auth/ui/components/sign-in-status";
import { SidebarUserButton } from "@/modules/users/ui/components/sidebar-user-button";

interface Props {
  content: React.ReactNode;
  footerButton?: React.ReactNode;
  children?: React.ReactNode;
}

export const AppSidebar: FC<Props> = ({
  content,
  footerButton = <SidebarUserButton />,
  children,
}) => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <ResponsiveSidebar>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-xl text-nowrap">WDS Jobs</span>
          </SidebarHeader>
          <SidebarContent>{content}</SidebarContent>
          {/* 已登录时展示的侧边栏 */}
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>{footerButton}</SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <main className="flex-1">{children}</main>
      </ResponsiveSidebar>
    </SidebarProvider>
  );
};
