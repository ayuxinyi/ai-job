// 服务器函数，只能在服务器端调用
"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import db from "@/db/db";
import { OrganizationsTable, UsersTable } from "@/db/schema";
import { getOrganizationIdTag } from "@/modules/organizations/cache/organizations";
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

  cacheLife("days");

  return await db.query.UsersTable.findFirst({
    where: eq(UsersTable.id, userId),
  });
}

export async function getCurrentOrganization({ allData = false } = {}) {
  const { orgId } = await auth();

  return {
    orgId,
    organization: allData && orgId ? await getOrganization(orgId) : undefined,
  };
}

async function getOrganization(orgId: string) {
  //  缓存
  "use cache";
  // 缓存用户数据，标签为用户ID
  cacheTag(getOrganizationIdTag(orgId));

  cacheLife("days");

  return await db.query.OrganizationsTable.findFirst({
    where: eq(OrganizationsTable.id, orgId),
  });
}
