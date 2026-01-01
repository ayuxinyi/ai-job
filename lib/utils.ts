import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ZodError } from "zod";

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
