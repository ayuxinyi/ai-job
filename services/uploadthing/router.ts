import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import db from "@/db/db";
import { UserResumeTable } from "@/db/schema";
import { upsertUserResume } from "@/modules/resume/actions/resume.action";

import { getCurrentUser } from "../clerk/actions/get-current-auth";
import { inngest } from "../inngest/client";
import { uploadthing } from "./client";

const f = createUploadthing();

// 基础文件上传路由
export const customFileRouter = {
  // 简历上传端点
  resumeUploader: f(
    {
      pdf: {
        maxFileSize: "8MB",
        maxFileCount: 1,
      },
    },
    // 通过设置 awaitServerData 为 true，我们可以在客户端监听文上传完成的事件
    { awaitServerData: true }
  )
    .middleware(async () => {
      const { userId } = await getCurrentUser();
      if (!userId)
        throw new UploadThingError(
          "很抱歉，您没有权限上传文件，请确认您已登录"
        );

      // 这里返回的数据会被 onUploadComplete 中的 metadata 接收
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId } = metadata;
      const resumeFileKey = await getUserResumeFileKey(userId);

      await upsertUserResume(userId, {
        resumeFileUrl: file.ufsUrl,
        resumeFileKey: file.key,
      });

      if (resumeFileKey) {
        // 删除旧的简历
        await uploadthing.deleteFiles(resumeFileKey);
      }
      // 调用inngest事件,通过AI生成简历总结
      await inngest.send({
        name: "app/resume.uploaded",
        user: {
          id: userId,
        },
      });

      return { message: "简历上传成功" };
    }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;

async function getUserResumeFileKey(userId: string) {
  const data = await db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
    columns: {
      resumeFileKey: true,
    },
  });

  return data?.resumeFileKey;
}
