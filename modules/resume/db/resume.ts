import { eq } from "drizzle-orm";

import db from "@/db/db";
import type { UserResume } from "@/db/schema";
import { UserResumeTable } from "@/db/schema";

import { revalidateUserResumeCache } from "../caches/resume";

export const getUserResumeByUserIdDb = async (userId: string) => {
  return await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
};

export const upsertUserResumeDb = async (
  userId: string,
  data: Omit<UserResume, "userId">
) => {
  await db
    .insert(UserResumeTable)
    .values({ userId, ...data })
    .onConflictDoUpdate({
      target: UserResumeTable.userId,
      set: data,
    });

  revalidateUserResumeCache(userId);
};

export const updateUserResume = async (userId: string, aiSummary: string) => {
  await db
    .update(UserResumeTable)
    .set({ aiSummary })
    .where(eq(UserResumeTable.userId, userId));
  revalidateUserResumeCache(userId);
};
