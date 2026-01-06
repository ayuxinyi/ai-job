import { NonRetriableError } from "inngest";
import { Webhook } from "svix";

import {
  deleteOrganizationUserSettings,
  insertOrganizationUserSettings,
} from "@/modules/organizations/db/organization-user-settings";
import {
  deleteOrganization,
  insertOrganization,
  updateOrganization,
} from "@/modules/organizations/db/organizations";
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

// 处理 Clerk 组织创建事件，将组织数据存储到数据库中
export const clerkCreateOrganization = inngest.createFunction(
  {
    id: "clerk/create-db-organization",
    name: "Clerk - Create DB Organization",
  },
  {
    event: "clerk/organization.created",
  },
  async ({ event, step }) => {
    await step.run("verify-webhook", async () => {
      try {
        verifyWebhook({
          raw: event.data.raw,
          headers: event.data.headers,
        });
      } catch {
        throw new NonRetriableError("很抱歉，我们无法验证 Webhook 签名");
      }
    });
    await step.run("create-organization", async () => {
      const organizationData = event.data.data;

      await insertOrganization({
        id: organizationData.id,
        imageUrl: organizationData.image_url || "",
        name: organizationData.name,
        createdAt: new Date(organizationData.created_at),
        updatedAt: new Date(organizationData.updated_at),
      });

      return organizationData.id;
    });
  }
);

// 处理 Clerk 组织删除事件，从数据库中删除组织
export const clerkDeleteOrganization = inngest.createFunction(
  {
    id: "clerk/delete-db-organization",
    name: "Clerk - Delete DB Organization",
  },
  {
    event: "clerk/organization.deleted",
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
      const organizationId = event.data.data.id;

      if (!organizationId) {
        throw new NonRetriableError(
          "很抱歉，我们无法获取组织ID，无法删除组织，请检查该事件是否来自Clerk"
        );
      }
      await deleteOrganization(organizationId);
    });
  }
);

// 处理 Clerk 组织更新事件，更新组织数据
export const clerkUpdateOrganization = inngest.createFunction(
  {
    id: "clerk/update-db-organization",
    name: "Clerk - Update DB Organization",
  },
  {
    event: "clerk/organization.updated",
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
      const organizationData = event.data.data;
      const organizationId = organizationData.id;
      if (!organizationId) {
        throw new NonRetriableError(
          "很抱歉，我们无法获取组织ID，无法更新组织，请检查该事件是否来自Clerk"
        );
      }

      await updateOrganization(organizationId, {
        name: organizationData.name,
        imageUrl: organizationData.image_url || "",
        updatedAt: new Date(organizationData.updated_at),
      });
    });
  }
);

// 处理 Clerk 组织成员创建事件，将组织成员数据存储到数据库中
export const clerkCreateOrganizationMembership = inngest.createFunction(
  {
    id: "clerk/create-db-organization-membership",
    name: "Clerk - Create DB Organization Membership",
  },
  {
    event: "clerk/organizationMembership.created",
  },
  async ({ event, step }) => {
    await step.run("verify-webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch {
        throw new NonRetriableError("很抱歉，我们无法验证 Webhook 签名");
      }
    });

    await step.run("create-organization-membership", async () => {
      const userId = event.data.data.public_user_data.user_id;
      const orgId = event.data.data.organization.id;

      await insertOrganizationUserSettings({
        userId,
        organizationId: orgId,
      });
    });
  }
);

export const clerkDeleteOrganizationMembership = inngest.createFunction(
  {
    id: "clerk/delete-db-organization-membership",
    name: "Clerk - Delete DB Organization Membership",
  },
  {
    event: "clerk/organizationMembership.deleted",
  },
  async ({ event, step }) => {
    await step.run("verify-webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch {
        throw new NonRetriableError("很抱歉，我们无法验证 Webhook 签名");
      }
    });

    await step.run("delete-organization-membership", async () => {
      const userId = event.data.data.id;
      const orgId = event.data.data.organization.id;
      await deleteOrganizationUserSettings({
        userId,
        organizationId: orgId,
      });
    });
  }
);
