import { createAgent, createTool, openai } from "@inngest/agent-kit";
import { number, object, string } from "zod";

import { updateJobListingApplication } from "@/modules/job-listing-applicant/db/job-listing-application.db";
import env from "@/utils/env";

// sk-4b34cd1a6fcc4fdb85c55a3afcd9bd3d
const saveApplicantRatingTool = createTool({
  name: "save-applicant-ranking",
  description: "将求职者针对某一具体岗位的评分结果保存到数据库中",
  parameters: object({
    rating: number().int().max(5).min(1),
    jobListingId: string(),
    userId: string(),
  }),
  async handler({ rating, jobListingId, userId }) {
    await updateJobListingApplication({
      jobListingId,
      userId,
      rating,
    });
    return "已经成功保存您的评分结果";
  },
});

export const applicationRankingAgent = createAgent({
  name: "Application Ranking Agent",
  description:
    "一个根据求职信和简历内容，对特定岗位的求职申请进行智能评估与排序的 AI Agent。",
  system: `
    你是一名擅长根据求职者的简历和求职信，为特定岗位评估并排序候选人的专家。
    你将收到一个用户提示，其中包含用户的 ID、该用户的简历与求职信，以及其所申请岗位的职位信息，数据格式为 JSON。
    你的任务是将岗位要求与求职者的简历和求职信进行对比，评估该求职者与该岗位的匹配程度，并给出一个评分。
    评分范围为 1 到 5 分，其中：
    - 5 分表示与岗位要求完全或几乎完全匹配
    - 3 分表示仅勉强满足岗位的最低要求
    - 1 分表示不符合岗位要求
    你需要将该评分保存到数据库中，且不要返回任何输出结果。
  `,
  tools: [saveApplicantRatingTool],
  model: openai({
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: env.OPENROUTER_API_KEY,
    model: "xiaomi/mimo-v2-flash:free",
  }),
});
