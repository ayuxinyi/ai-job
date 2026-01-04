import { differenceInDays } from "date-fns";
import Link from "next/link";
import { connection } from "next/server";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SignUpButton } from "@/modules/auth/ui/components/auth-buttons";
import NewJobListingApplicationForm from "@/modules/job-listing-applicant/ui/components/new-job-listing-application-form";
import { getUserResumeByUserId } from "@/modules/resume/actions/resume.action";
import { getCurrentUser } from "@/services/clerk/actions/get-current-auth";

import { getJobListingApplicationById } from "../../actions/job-listing.action";

interface Props {
  jobListingId: string;
}
export const ApplyButton = async ({ jobListingId }: Props) => {
  const { userId } = await getCurrentUser();
  if (!userId) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>申请岗位</Button>
        </PopoverTrigger>
        <PopoverContent>
          很抱歉，您需要先创建一个账号，请点击“注册账号”按钮进行注册后，再进行岗位申请。
          <SignUpButton />
        </PopoverContent>
      </Popover>
    );
  }
  const application = await getJobListingApplicationById({
    jobListingId,
    userId,
  });
  if (application) {
    const formatter = new Intl.RelativeTimeFormat("zh-CN", {
      style: "short",
      numeric: "always",
    });
    await connection();
    const difference = differenceInDays(application.createdAt, new Date());
    return (
      <div className="text-muted-foreground text-sm">
        您已在{" "}
        {difference === 0 ? "今天" : formatter.format(difference, "days")}{" "}
        申请过此岗位
      </div>
    );
  }
  const userResume = await getUserResumeByUserId(userId);
  if (userResume) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>申请岗位</Button>
        </PopoverTrigger>
        <PopoverContent>
          很抱歉，您需要先上传一个简历，请点击“上传简历”按钮进行上传后，再进行岗位申请。
          <Button asChild>
            <Link href="/user-settings/resume">上传简历</Link>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>申请岗位</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl max-h[calc(100%-2rem)] outline-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>申请岗位</DialogTitle>
          <DialogDescription>
            一旦点击“确认申请”按钮，您将无法撤销此申请，并且将无法再次申请此岗位。
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <NewJobListingApplicationForm jobListingId={jobListingId} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
