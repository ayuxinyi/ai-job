import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";

import { WAGE_INTERVALS } from "@/constants";
import type { WageInterval } from "@/db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formateZodError(error: ZodError) {
  const fields = Array.from(
    new Set(error.issues.map(err => err.path.join(".")))
  ).filter(f => f); // 去掉空字段

  const message = fields.length
    ? `很抱歉，请检查表单中的 ${fields
        .map(f => `「${f}」`)
        .join("、")} 字段是否填写正确`
    : "很抱歉，您的表单存在错误，请检查后重试";

  return {
    message,
    fields,
  };
}

export function formatJobListingBadge(
  arr: Array<Record<string, string>>,
  value: string | undefined
) {
  if (!value) return "";
  return arr.find(item => item.value === value)?.label || value;
}

export function formatWage(wage: number, wageInterval: WageInterval) {
  const wageFormatter = new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
  });
  return (
    formatJobListingBadge(WAGE_INTERVALS, wageInterval) +
    " " +
    wageFormatter.format(wage)
  );
}

export function formatLocation(
  stateAbbreviation: string | null | undefined,
  city: string | null | undefined
) {
  if (!stateAbbreviation && !city) return "暂未填写";
  const locationParts = [];
  if (stateAbbreviation) locationParts.push(stateAbbreviation.toUpperCase());
  if (city) locationParts.push(city);
  return locationParts.join(", ");
}
