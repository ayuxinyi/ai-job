import type {
  DeletedObjectJSON,
  OrganizationJSON,
  OrganizationMembershipJSON,
  UserJSON,
} from "@clerk/nextjs/server";
import { EventSchemas, Inngest } from "inngest";

import type { JobListingSelect } from "@/db/schema";
type ClerkWebhookData<T> = {
  data: {
    data: T;
    raw: string;
    headers: Record<string, string>;
  };
};

type EventJobListing = Omit<
  JobListingSelect,
  "createdAt" | "postedAt" | "updatedAt" | "status" | "organizationId"
> & {
  organizationName: string;
};

// 定义事件类型，这样我们可以在inngest函数中得到更好的类型提示
type Events = {
  "clerk/user.created": ClerkWebhookData<UserJSON>;
  "clerk/user.updated": ClerkWebhookData<UserJSON>;
  "clerk/user.deleted": ClerkWebhookData<DeletedObjectJSON>;
  "clerk/organization.created": ClerkWebhookData<OrganizationJSON>;
  "clerk/organization.updated": ClerkWebhookData<OrganizationJSON>;
  "clerk/organization.deleted": ClerkWebhookData<DeletedObjectJSON>;
  "clerk/organizationMembership.created": ClerkWebhookData<OrganizationMembershipJSON>;
  "clerk/organizationMembership.deleted": ClerkWebhookData<OrganizationMembershipJSON>;
  "app/jobListingApplication.created": {
    data: {
      jobListingId: string;
      userId: string;
    };
  };
  "app/resume.uploaded": {
    user: {
      id: string;
    };
  };
  "app/email.daily-user-job-listings": {
    data: {
      aiPrompt?: string;
      jobListings: EventJobListing[];
    };
    user: {
      email: string;
      name: string;
    };
  };
};

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "job-board-wds",
  // 从事件类型中创建事件架构
  schemas: new EventSchemas().fromRecord<Events>(),
});
