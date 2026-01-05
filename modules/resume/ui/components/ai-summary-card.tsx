import { notFound } from "next/navigation";

import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MarkdownRender } from "@/modules/job-listing/ui/components/markdown/markdown-render";
import { getCurrentUser } from "@/services/clerk/actions/get-current-auth";

import { getUserResumeByUserId } from "../../actions/resume.action";

const AISummaryCard = async () => {
  const { userId } = await getCurrentUser();
  if (!userId) return notFound();

  const resume = await getUserResumeByUserId(userId);
  if (!resume || !resume.aiSummary) return null;

  return (
    <CardHeader className="border-b">
      <CardTitle>AI 摘要</CardTitle>
      <CardDescription>
        这是您的简历的 AI
        摘要，包含了您的简历的主要信息。可以帮助雇主快速了解您的简历。
      </CardDescription>
      <CardContent>
        <MarkdownRender source={resume.aiSummary} />
      </CardContent>
    </CardHeader>
  );
};
export default AISummaryCard;
