import { timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { OrganizationsTable, UsersTable } from "./schema";

// 将公共字段提取出来，方便在其他表中使用
export const id = uuid().primaryKey().defaultRandom();
export const userId = varchar()
  .notNull()
  .references(() => UsersTable.id, { onDelete: "cascade" });
export const organizationId = varchar()
  .notNull()
  .references(() => OrganizationsTable.id, { onDelete: "cascade" });
export const createdAt = timestamp().notNull().defaultNow();
export const updatedAt = timestamp()
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());
