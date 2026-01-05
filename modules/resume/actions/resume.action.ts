"use server";
import { cacheLife, cacheTag } from "next/cache";

import type { UserResume } from "@/db/schema";

import { getUserResumeIdTag } from "../caches/resume";
import { getUserResumeByUserIdDb, upsertUserResumeDb } from "../db/resume";

export const getUserResumeByUserId = async (userId: string) => {
  "use cache";
  cacheTag(getUserResumeIdTag(userId));
  cacheLife("minutes");

  return await getUserResumeByUserIdDb(userId);
};

export const upsertUserResume = async (
  userId: string,
  { resumeFileUrl, resumeFileKey }: Omit<UserResume, "userId">
) => {
  await upsertUserResumeDb(userId, { resumeFileUrl, resumeFileKey });
};
