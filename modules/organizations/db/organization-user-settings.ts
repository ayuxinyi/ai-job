import { and, eq } from "drizzle-orm";

import db from "@/db/db";
import {
  type OrganizationUserSettingsInsert,
  OrganizationUserSettingsTable,
} from "@/db/schema";

import { revalidateOrganizationUserSettingsCache } from "../cache/organizations-user-settings";

export const insertOrganizationUserSettings = async (
  settings: OrganizationUserSettingsInsert
) => {
  await db
    .insert(OrganizationUserSettingsTable)
    .values(settings)
    .onConflictDoNothing();

  revalidateOrganizationUserSettingsCache(settings);
};

export const deleteOrganizationUserSettings = async (
  settings: OrganizationUserSettingsInsert
) => {
  await db
    .delete(OrganizationUserSettingsTable)
    .where(
      and(
        eq(
          OrganizationUserSettingsTable.organizationId,
          settings.organizationId
        ),
        eq(OrganizationUserSettingsTable.userId, settings.userId)
      )
    );

  revalidateOrganizationUserSettingsCache(settings);
};

export const updateOrganizationUserSettingsDb = async (
  { userId, organizationId }: { userId: string; organizationId: string },
  settings: Omit<OrganizationUserSettingsInsert, "userId" | "organizationId">
) => {
  const [created] = await db
    .insert(OrganizationUserSettingsTable)
    .values({
      ...settings,
      userId,
      organizationId,
    })
    .onConflictDoUpdate({
      target: [
        OrganizationUserSettingsTable.userId,
        OrganizationUserSettingsTable.organizationId,
      ],
      set: settings,
    })
    .returning({
      organizationId: OrganizationUserSettingsTable.organizationId,
      userId: OrganizationUserSettingsTable.userId,
    });

  revalidateOrganizationUserSettingsCache(created);
};
