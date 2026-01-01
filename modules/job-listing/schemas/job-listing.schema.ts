import type { output } from "zod";
import { enum as enum_, number, object, string } from "zod";

import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
  wageIntervals,
} from "@/db/schema";

export const JobListingSchema = object({
  title: string("岗位标题不能为空").min(1, "岗位标题不能为空"),
  // 薪资不能为空，且必须为整数，且必须大于等于1
  wage: number("薪资不能为空")
    .int("薪资必须为整数")
    .positive("薪资必须大于等于1")
    .min(1, "薪资必须大于等于1")
    .nullable(),
  description: string("岗位描述不能为空").min(1, "岗位描述不能为空"),
  experienceLevel: enum_(experienceLevels, "职业水平不能为空"),
  locationRequirement: enum_(locationRequirements, "工作地点要求不能为空"),
  type: enum_(jobListingTypes, "工作类型不能为空"),
  wageInterval: enum_(wageIntervals).nullable(),
  // nullable 表示该字段可以为空
  stateAbbreviation: string()
    .transform(val => (val.trim() === "" ? null : val))
    .nullable(),
  city: string()
    .transform(val => (val.trim() === "" ? null : val))
    .nullable(),
})
  .refine(
    listing => {
      return listing.locationRequirement === "remote" || listing.city !== null;
    },
    {
      message: "您选择的工作地点要求为办公室工作，则城市字段不能为空",
      path: ["city"],
    }
  )
  .refine(
    listing => {
      return (
        listing.locationRequirement === "remote" ||
        listing.stateAbbreviation !== null
      );
    },
    {
      message: "您选择的工作地点要求为办公室工作，则州缩写字段不能为空",
      path: ["stateAbbreviation"],
    }
  );

export type JobListingSchema = output<typeof JobListingSchema>;
