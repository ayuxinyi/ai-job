import { eq } from "drizzle-orm";

import db from "@/db/db";
import type { Organization } from "@/db/schema";
import { OrganizationsTable } from "@/db/schema";

import { revalidateOrganizationCache } from "../cache/organizations";

export const insertOrganization = async (organization: Organization) => {
  await db
    .insert(OrganizationsTable)
    .values(organization)
    .onConflictDoNothing();
  revalidateOrganizationCache(organization.id);
};

export const deleteOrganization = async (organizationId: string) => {
  await db
    .delete(OrganizationsTable)
    .where(eq(OrganizationsTable.id, organizationId));
  revalidateOrganizationCache(organizationId);
};

export const updateOrganization = async (
  organizationId: string,
  organization: Partial<Organization>
) => {
  await db
    .update(OrganizationsTable)
    .set(organization)
    .where(eq(OrganizationsTable.id, organizationId));
  revalidateOrganizationCache(organizationId);
};
