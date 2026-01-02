import { EditIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";

import type { jobListingStatus } from "@/db/schema";
import { hasReachedMaxFeaturedJobListings } from "@/modules/job-listing/lib/plan-feature-helper";
import { getNextJobListingStatus } from "@/modules/job-listing/lib/utils";
import { hasOrgUserPermission } from "@/services/clerk/lib/org-user-permissions";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import AsyncIf from "./async-if";

export const StatusButton = ({ status }: { status: jobListingStatus }) => {
  const button = <Button variant="outline">切换状态</Button>;
  return (
    <AsyncIf
      condition={() =>
        hasOrgUserPermission("org:job_listing:job_listings_change_status")
      }
    >
      {getNextJobListingStatus(status) === "published" ? (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxFeaturedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {statusToggleButtonText(status)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="flex-col flex gap-2">
                您必须要先升级您的计划，才能发布更多的岗位。
                <Button asChild>
                  <Link href="/employer/pricing">升级计划</Link>
                </Button>
              </PopoverContent>
            </Popover>
          }
        >
          {button}
        </AsyncIf>
      ) : (
        button
      )}
    </AsyncIf>
  );
};

export const EditButton = ({ id }: { id: string }) => {
  return (
    <AsyncIf
      condition={() =>
        hasOrgUserPermission("org:job_listing:job_listings_update")
      }
    >
      <Button asChild variant="outline">
        <Link href={`/employer/job-listings/${id}/edit`}>
          <EditIcon className="size-4" />
          编辑
        </Link>
      </Button>
    </AsyncIf>
  );
};

const statusToggleButtonText = (status: jobListingStatus) => {
  switch (status) {
    case "draft":
    case "delisted":
      return (
        <>
          <EyeIcon className="size-4" />
          发布岗位
        </>
      );
    case "published":
      return (
        <>
          <EyeOffIcon className="size-4" />
          下架岗位
        </>
      );
    default:
      throw new Error(`很抱歉，${status} 不是一个有效的状态`);
  }
};
