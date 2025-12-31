import { eq } from "drizzle-orm";

import db from "@/db/db";
import { UsersTable } from "@/db/schema";

import { revalidateUserCache } from "../cache/users";

export const insertUser = async (user: typeof UsersTable.$inferInsert) => {
  await db.insert(UsersTable).values(user).onConflictDoNothing();
  // .onConflictDoUpdate({
  //   // target 是要检查冲突的列，这里是 id，如果 id 冲突了，就更新
  //   target: UsersTable.id,
  //   // set 是要更新的列，这里是 user 表的所有列
  //   set: user,
  // });
  // 重新验证用户缓存
  revalidateUserCache(user.id);
};

export const deleteUser = async (userId: string) => {
  await db.delete(UsersTable).where(eq(UsersTable.id, userId));
  revalidateUserCache(userId);
};

export const updateUser = async (
  userId: string,
  user: Partial<typeof UsersTable.$inferInsert>
) => {
  await db.update(UsersTable).set(user).where(eq(UsersTable.id, userId));
  // 重新验证用户缓存
  revalidateUserCache(userId);
};
