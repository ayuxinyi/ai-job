import { type FC, Suspense } from "react";

import { IsBreakpoint } from "@/components/app/is-break-point";
import { LoadingSpinner } from "@/components/app/loading-spinner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { JobListingDetails } from "@/modules/job-listing/ui/components/job-listing-details";
import { JobListingItems } from "@/modules/job-seeker/ui/components/job-listing-items";

import { ClientSheet } from "./_client-sheet";

interface Props {
  searchParams: Promise<Record<string, string | string[]>>;
  params: Promise<{
    jobListingId: string;
  }>;
}

const JobListingPage: FC<Props> = ({ params, searchParams }) => {
  return (
    <ResizablePanelGroup direction="horizontal" autoSaveId="job-board-panel">
      <ResizablePanel id="left" order={1} defaultSize={60} minSize={30}>
        <div className="p-4 h-screen overflow-y-auto">
          <JobListingItems searchParams={searchParams} params={params} />
        </div>
      </ResizablePanel>
      <IsBreakpoint
        breakpoint="min-width: 1024px"
        otherwise={
          <ClientSheet>
            <SheetContent className="p-4 overflow-y-auto">
              <SheetHeader className="sr-only">
                <SheetTitle>岗位详情</SheetTitle>
              </SheetHeader>
              <Suspense fallback={<LoadingSpinner />}>
                <JobListingDetails
                  searchParams={searchParams}
                  params={params}
                />
              </Suspense>
            </SheetContent>
          </ClientSheet>
        }
      >
        <ResizableHandle withHandle className="mx-2" />
        <ResizablePanel id="right" order={2} defaultSize={40} minSize={30}>
          <div className="p-4 h-screen overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <JobListingDetails searchParams={searchParams} params={params} />
            </Suspense>
          </div>
        </ResizablePanel>
      </IsBreakpoint>
    </ResizablePanelGroup>
  );
};
export default JobListingPage;
