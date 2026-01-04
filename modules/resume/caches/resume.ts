import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag } from "@/lib/data-cache";

export const getUserResumeGlobalTag = () => getGlobalTag("userResumes");

export const getUserResumeIdTag = (userId: string) =>
  getIdTag("userResumes", userId);

export const revalidateUserResumeCache = (userId: string) => {
  revalidateTag(getUserResumeGlobalTag(), "max");
  revalidateTag(getUserResumeIdTag(userId), "max");
};
