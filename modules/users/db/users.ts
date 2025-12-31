import db from "@/db/db";
import { UsersTable } from "@/db/schema";

export const insertUser = async (user: typeof UsersTable.$inferInsert) => {
  await db.insert(UsersTable).values(user).onConflictDoNothing();
  // .onConflictDoUpdate({
  //   // target 是要检查冲突的列，这里是 id，如果 id 冲突了，就更新
  //   target: UsersTable.id,
  //   // set 是要更新的列，这里是 user 表的所有列
  //   set: user,
  // });
};
