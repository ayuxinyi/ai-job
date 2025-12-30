import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ResponsiveSidebar } from "../components/responsive-sidebar";
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
          <SidebarContent>sss</SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>ss</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <HomeSection />
      </ResponsiveSidebar>
    </SidebarProvider>
  );
};
