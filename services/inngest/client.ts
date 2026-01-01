import type {
  DeletedObjectJSON,
  OrganizationJSON,
  UserJSON,
} from "@clerk/nextjs/server";
import { EventSchemas, Inngest } from "inngest";
type ClerkWebhookData<T> = {
  data: {
    data: T;
    raw: string;
    headers: Record<string, string>;
  };
};
// 定义事件类型，这样我们可以在inngest函数中得到更好的类型提示
type Events = {
  "clerk/user.created": ClerkWebhookData<UserJSON>;
  "clerk/user.updated": ClerkWebhookData<UserJSON>;
  "clerk/user.deleted": ClerkWebhookData<DeletedObjectJSON>;
  "clerk/organization.created": ClerkWebhookData<OrganizationJSON>;
  "clerk/organization.updated": ClerkWebhookData<OrganizationJSON>;
  "clerk/organization.deleted": ClerkWebhookData<DeletedObjectJSON>;
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "job-board-wds",
  // 从事件类型中创建事件架构
  schemas: new EventSchemas().fromRecord<Events>(),
});
