import { eq } from "drizzle-orm";

import db from "@/db/db";
import { UserResumeTable } from "@/db/schema";

export const getUserResumeByUserIdDb = async (userId: string) => {
  return await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  });
};
