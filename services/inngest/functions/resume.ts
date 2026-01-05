import { extractPdfText, generateResumeSummary } from "@/lib/ai";
import { getUserResumeByUserId } from "@/modules/resume/actions/resume.action";
import { updateUserResume } from "@/modules/resume/db/resume";

import { inngest } from "../client";

export const createAiSummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uploaded-resume",
    name: "Create AI Summary of Uploaded Resume",
  },
  {
    event: "app/resume.uploaded",
  },
  async ({ event, step }) => {
    const { id: userId } = event.user;
    const userResume = await step.run("get-user-resume", async () => {
      return await getUserResumeByUserId(userId);
    });

    if (!userResume) return;

    const resumeText = await step.run("parse-resume-pdf", async () => {
      return await extractPdfText(userResume.resumeFileUrl);
    });
    if (!resumeText) return;
    const AISummary = await step.run("generate-ai-summary", async () => {
      return await generateResumeSummary(resumeText);
    });
    console.error("🚀 ~ AISummary:", AISummary);

    if (!AISummary || !AISummary.content) return;

    await step.run("save-ai-summary", async () => {
      await updateUserResume(userId, AISummary.content!);
    });
  }
);
