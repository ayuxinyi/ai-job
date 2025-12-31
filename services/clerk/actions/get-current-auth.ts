// 服务器函数，只能在服务器端调用
"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/cache";

import db from "@/db/db";
import { UsersTable } from "@/db/schema";
import { getUserIdTag } from "@/modules/users/cache/users";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId } = await auth();

  return {
    userId,
    user: allData && userId ? await getUser(userId) : undefined,
  };
}

async function getUser(userId: string) {
  //  缓存
  "use cache";
  // 缓存用户数据，标签为用户ID
  cacheTag(getUserIdTag(userId));

  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.id, userId),
  });
}
