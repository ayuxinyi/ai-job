import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { getCurrentUser } from "@/services/clerk/actions/get-current-auth";

import { getUserResumeByUserId } from "../../actions/resume.action";

export const ResumeDetails = async () => {
  const { userId } = await getCurrentUser();
  if (!userId) return notFound();

  const userResume = await getUserResumeByUserId(userId);
  if (!userResume) return null;

  return (
    <CardFooter>
      <Button asChild>
        <Link
          href={userResume.resumeFileUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          查看简历
        </Link>
      </Button>
    </CardFooter>
  );
};
