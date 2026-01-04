"use server";
import { cacheLife, cacheTag } from "next/cache";

import { getUserResumeIdTag } from "../caches/resume";
import { getUserResumeByUserIdDb } from "../db/resume";

export const getUserResumeByUserId = async (userId: string) => {
  "use cache";
  cacheTag(getUserResumeIdTag(userId));
  cacheLife("minutes");

  return await getUserResumeByUserIdDb(userId);
};
