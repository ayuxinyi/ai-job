import "dotenv/config";

import { defineConfig } from "drizzle-kit";

import env from "./utils/env";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  casing: "snake_case",
  strict: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
