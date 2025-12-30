import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import env from "@/utils/env";

import * as schema from "./schema";

const sql = neon(env.DATABASE_URL);
const db = drizzle({ client: sql, logger: true, schema, casing: "snake_case" });

export default db;
