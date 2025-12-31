import { LogInIcon } from "lucide-react";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ResponsiveSidebar } from "../components/responsive-sidebar";
import { SidebarUserButton } from "../components/sidebar-user-button";
import { SignedIn, SignedOut } from "../components/sign-in-status";
import { HomeSection } from "../sections/home-section";

export const HomeLayout = () => {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <ResponsiveSidebar>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-xl text-nowrap">WDS Jobs</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SignedOut>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/sign-in">
                        <LogInIcon />
                        <span>登 录</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SignedOut>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          {/* 已登录时展示的侧边栏 */}
          <SignedIn>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarUserButton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SignedIn>
        </Sidebar>
        <HomeSection />
      </ResponsiveSidebar>
    </SidebarProvider>
  );
};
