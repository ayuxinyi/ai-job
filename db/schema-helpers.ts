import { timestamp, uuid } from "drizzle-orm/pg-core";

// 将公共字段提取出来，方便在其他表中使用
export const id = uuid().primaryKey().defaultRandom();

export const createdAt = timestamp().notNull().defaultNow();
export const updatedAt = timestamp()
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());
