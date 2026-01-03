import {
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  StarIcon,
  StarOffIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { jobListingStatus } from "@/db/schema";
import {
  deleteJobListing,
  toggleJobListingFeatured,
  toggleJobListingStatus,
} from "@/modules/job-listing/actions/job-listing.action";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "@/modules/job-listing/lib/plan-feature-helper";
import { getNextJobListingStatus } from "@/modules/job-listing/lib/utils";
import { hasOrgUserPermission } from "@/services/clerk/lib/org-user-permissions";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ActionButton } from "./action-button";
import AsyncIf from "./async-if";

// 岗位状态切换按钮
export const StatusButton = ({
  status,
  id,
}: {
  status: jobListingStatus;
  id: string;
}) => {
  const button = (
    <ActionButton
      variant="outline"
      action={toggleJobListingStatus.bind(null, id)}
      requireAreYouSure={getNextJobListingStatus(status) === "published"}
      areYouSureDescription="您确定发布这个岗位，一旦发布，该岗位将对所有用户可见。"
    >
      {statusToggleButtonText(status)}
    </ActionButton>
  );
  return (
    <AsyncIf
      condition={() =>
        hasOrgUserPermission("org:job_listing:job_listings_change_status")
      }
    >
      {getNextJobListingStatus(status) === "published" ? (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxPublishedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <UpgradePopover
              buttonText={statusToggleButtonText(status)}
              popoverText="您必须要先升级您的计划，才能发布更多的岗位。"
            />
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

// 升级计划提示弹窗
const UpgradePopover = ({
  popoverText,
  buttonText,
}: {
  buttonText: ReactNode;
  popoverText: ReactNode;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">{buttonText}</Button>
    </PopoverTrigger>
    <PopoverContent className="flex-col flex gap-2">
      {popoverText}
      <Button asChild>
        <Link href="/employer/pricing">升级计划</Link>
      </Button>
    </PopoverContent>
  </Popover>
);

// 岗位编辑按钮
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

// 岗位状态切换按钮文本
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

// 岗位是否精选切换按钮
export const FeaturedToggleButton = ({
  isFeatured,
  id,
}: {
  isFeatured: boolean;
  id: string;
}) => {
  const button = (
    <ActionButton
      variant="outline"
      action={toggleJobListingFeatured.bind(null, id)}
    >
      {featuredToggleButtonText(isFeatured)}
    </ActionButton>
  );
  return (
    <AsyncIf
      condition={() =>
        hasOrgUserPermission("org:job_listing:job_listings_change_status")
      }
    >
      {isFeatured ? (
        button
      ) : (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxFeaturedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <UpgradePopover
              buttonText={featuredToggleButtonText(isFeatured)}
              popoverText="您必须要先升级您的计划，才能设置更多的精选岗位。"
            />
          }
        >
          {button}
        </AsyncIf>
      )}
    </AsyncIf>
  );
};

const featuredToggleButtonText = (isFeatured: boolean) => {
  return isFeatured ? (
    <>
      <StarOffIcon className="size-4" />
      取消精选
    </>
  ) : (
    <>
      <StarIcon className="size-4" />
      精选岗位
    </>
  );
};

export const DeleteButton = ({ id }: { id: string }) => {
  return (
    <AsyncIf
      condition={() =>
        hasOrgUserPermission("org:job_listing:job_listings_delete")
      }
    >
      <ActionButton
        variant="destructive"
        action={deleteJobListing.bind(null, id)}
        requireAreYouSure
        areYouSureDescription="您确定要删除此岗位吗？删除后将无法恢复。"
      >
        <TrashIcon className="size-4" />
        删除岗位
      </ActionButton>
    </AsyncIf>
  );
};
