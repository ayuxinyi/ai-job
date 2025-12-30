import { createEnv } from "@t3-oss/env-nextjs";
import { string } from "zod";

export const envTest = createEnv({
  server: {
    DATABASE_URL: string().min(1),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
