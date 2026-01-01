import type {
  experienceLevel,
  jobListingStatus,
  jobListingType,
  locationRequirement,
  WageInterval,
} from "@/db/schema";

// 工作工资间隔
export const WAGE_INTERVALS: { value: WageInterval; label: string }[] = [
  { value: "hourly", label: "每时结算" },
  { value: "daily", label: "每日结算" },
  { value: "weekly", label: "每周结算" },
  { value: "monthly", label: "每月结算" },
  { value: "yearly", label: "每年结算" },
];

// 工作地点要求
export const LOCATION_REQUIREMENTS: {
  value: locationRequirement;
  label: string;
}[] = [
  { value: "in-office", label: "现场办公" },
  { value: "remote", label: "远程办公" },
  { value: "hybrid", label: "混合办公" },
];

// 职业水平
export const EXPERIENCE_LEVELS: {
  value: experienceLevel;
  label: string;
}[] = [
  { value: "junior", label: "初级岗位" },
  { value: "mid-level", label: "中级岗位" },
  { value: "senior", label: "高级岗位" },
];

// 工作状态
export const JOB_LISTING_STATUSES: {
  value: jobListingStatus;
  label: string;
}[] = [
  { value: "draft", label: "草稿状态" },
  { value: "published", label: "已发布" },
  { value: "delisted", label: "下架状态" },
];

// 工作类型
export const JOB_TYPES: {
  value: jobListingType;
  label: string;
}[] = [
  { value: "full-time", label: "全职职位" },
  { value: "part-time", label: "兼职职位" },
  { value: "internship", label: "实习岗位" },
];
