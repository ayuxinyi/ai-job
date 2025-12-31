import { NonRetriableError } from "inngest";
import { Webhook } from "svix";

import { insertUserNotificationSettings } from "@/modules/users/db/user-notification-settings";
import { deleteUser, insertUser, updateUser } from "@/modules/users/db/users";
import env from "@/utils/env";

import { inngest } from "../client";

function verifyWebhook({
  raw,
  headers,
}: {
  raw: string;
  headers: Record<string, string>;
}) {
  // 验证 Webhook 签名，确保请求来自 Clerk
  return new Webhook(env.CLERK_WEBHOOK_SECRET).verify(raw, headers);
}

// 处理 Clerk 用户创建事件，将用户数据存储到数据库中
export const clerkCreateUser = inngest.createFunction(
  { id: "clerk/create-db-user", name: "Clerk - Create DB User" },
  {
    event: "clerk/user.created",
  },
  async ({ event, step }) => {
    await step.run("verify-webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch {
        throw new NonRetriableError("很抱歉，我们无法验证 Webhook 签名");
      }
    });
    const userId = await step.run("create-user", async () => {
      const userData = event.data.data;
      const email = userData.email_addresses.find(
        email => email.id === userData.primary_email_address_id
      );

      if (!email) {
        throw new NonRetriableError(
          "很抱歉，您的账号没有绑定邮箱，我们无法创建用户"
        );
      }

      await insertUser({
        id: userData.id,
        name: `${userData.first_name} ${userData.last_name}`,
        imageUrl: userData.image_url,
        email: email.email_address,
        createdAt: new Date(userData.created_at),
        updatedAt: new Date(userData.updated_at),
      });

      return userData.id;
    });

    await step.run("create-user-notification-settings", async () => {
      await insertUserNotificationSettings({ userId });
    });
  }
);

// 处理 Clerk 用户删除事件，从数据库中删除用户
export const clerkDeleteUser = inngest.createFunction(
  {
    id: "clerk/delete-db-user",
    name: "Clerk - Delete DB User",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event, step }) => {
    await step.run("verify-webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch {
        throw new NonRetriableError("很抱歉，我们无法验证 Webhook 签名");
      }
    });

    await step.run("delete-user", async () => {
      const userId = event.data.data.id;

      if (!userId) {
        throw new NonRetriableError(
          "很抱歉，我们无法获取用户ID，无法删除用户，请检查该事件是否来自Clerk"
        );
      }
      await deleteUser(userId);
    });
  }
);

// 处理 Clerk 用户更新事件，更新用户数据
export const clerkUpdateUser = inngest.createFunction(
  {
    id: "clerk/update-db-user",
    name: "Clerk - Update DB User",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event, step }) => {
    await step.run("verify-webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch {
        throw new NonRetriableError("很抱歉，我们无法验证 Webhook 签名");
      }
    });

    await step.run("update-user", async () => {
      const userData = event.data.data;
      const userId = userData.id;
      if (!userId) {
        throw new NonRetriableError(
          "很抱歉，我们无法获取用户ID，无法更新用户，请检查该事件是否来自Clerk"
        );
      }
      const email = userData.email_addresses.find(
        email => email.id === userData.primary_email_address_id
      );

      if (!email) {
        throw new NonRetriableError(
          "很抱歉，您的账号没有绑定邮箱，我们无法更新用户"
        );
      }

      await updateUser(userId, {
        name: `${userData.first_name} ${userData.last_name}`,
        imageUrl: userData.image_url || "",
        email: email.email_address,
        updatedAt: new Date(userData.updated_at),
      });
    });
  }
);
