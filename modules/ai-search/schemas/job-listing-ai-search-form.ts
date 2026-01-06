import type { output } from "zod";
import { object, string } from "zod";

export const JobListingAiSearchFormSchema = object({
  query: string("请输入搜索内容").min(1, "请输入搜索内容"),
});

export type JobListingAiSearchFormSchema = output<
  typeof JobListingAiSearchFormSchema
>;
