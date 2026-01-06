import { createAgent, openai } from "@inngest/agent-kit";
import type { output } from "zod";
import { enum as enum_, number, object, string } from "zod";

import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/db/schema";
import env from "@/utils/env";

import { getLastOutputMessage } from "./helpers/get-last-output-message";

const NO_JOBS = "暂无符合条件的岗位";

const listingSchema = object({
  id: string(),
  title: string(),
  description: string(),
  wage: number().nullable(),
  wageInterval: enum_(wageIntervals).nullable(),
  stateAbbreviation: string().nullable(),
  city: string().nullable(),
  experienceLevel: enum_(experienceLevels),
  type: enum_(jobListingTypes),
  locationRequirement: enum_(locationRequirements),
});

export const getMatchingJobListings = async (
  prompt: string,
  jobListings: output<typeof listingSchema>[],
  { maxNumberOfJobs }: { maxNumberOfJobs: number }
) => {
  const agent = createAgent({
    name: "Job Matching Agent",
    description:
      "用于根据用户的技能背景与求职需求，智能匹配合适岗位的 AI 智能代理",
    system: `你是一名擅长根据个人经验与求职需求，为用户匹配合适岗位的招聘专家型 AI 智能代理。
        用户提供的内容将是一段描述性文本，其中可能包含：
        - 用户的技能背景与工作经验
        - 用户对理想岗位的期望与要求
       你的任务是根据用户描述，从给定的岗位列表中筛选出符合其条件的岗位。
      ${
        maxNumberOfJobs
          ? `你最多可以返回 ${maxNumberOfJobs} 个最匹配的岗位。`
          : `请返回所有符合用户条件的岗位。`
      }
      请仅以 **英文逗号分隔的 jobId 列表** 作为最终输出，不要返回任何额外文字或解释。
      如果没有任何岗位符合用户的要求，请仅返回字符串 "${NO_JOBS}"。
      以下是当前可用的岗位信息（JSON 数组格式）：
      ${JSON.stringify(
        jobListings.map(listing =>
          listingSchema
            .transform(listing => ({
              ...listing,
              wage: listing.wage ?? undefined,
              wageInterval: listing.wageInterval ?? undefined,
              city: listing.city ?? undefined,
              stateAbbreviation: listing.stateAbbreviation ?? undefined,
              locationRequirement: listing.locationRequirement ?? undefined,
            }))
            .parse(listing)
        )
      )}
    `,
    model: openai({
      baseUrl: "https://openrouter.ai/api/v1",
      apiKey: env.OPENROUTER_API_KEY,
      model: "xiaomi/mimo-v2-flash:free",
    }),
  });
  const result = await agent.run(prompt);
  const lastMessage = getLastOutputMessage(result);
  if (!lastMessage || lastMessage === NO_JOBS) return [];
  return lastMessage
    .split(",")
    .map(jonId => jonId.trim())
    .filter(Boolean);
};
