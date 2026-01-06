/**
 * 定义环境变量的 schema，用于确保项目中所需的环境变量被正确设置。
 */

import type { output } from "zod";
import { string, z } from "zod";

import tryParseEnv from "./type-parse-env";

export const EnvSchema = z.object({
  NODE_ENV: string(),
  DATABASE_URL: string(),
  // Clerk 认证配置
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string(),
  NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: string(),
  // Clerk 认证配置 - 发布密钥
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string(),
  CLERK_SECRET_KEY: string(),
  // Clerk 认证配置 - Webhook 密钥
  CLERK_WEBHOOK_SECRET: string().min(10),
  // Uploadthing 配置
  UPLOADTHING_TOKEN: string().min(10),
  // OpenRouter API 配置
  OPENROUTER_API_KEY: string().min(10),
  // Resend API 配置
  RESEND_API_KEY: string().min(10),
  // 服务器URL
  SERVER_URL: string().min(10),
});
export type EnvSchema = output<typeof EnvSchema>;

// 尝试解析环境变量并返回类型安全的对象
tryParseEnv(EnvSchema);

// 解析环境变量并返回类型安全的对象，这里我们需要禁用 eslint 规则 node/no-process-env，因为
// 我们就是想要只在这里使用 process.env，在其它地方需要通过 EnvSchema.parse(process.env) 来获取环境变量
export default EnvSchema.parse(process.env);
