import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { JobListingFilterForm } from "@/modules/job-listing/ui/components/job-listing-filter-form";

export const JobBoardSidebar = () => {
  return (
    <SidebarGroup className="group-data-[state=collapsed]:hidden">
      <SidebarGroupContent>
        <JobListingFilterForm />
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
