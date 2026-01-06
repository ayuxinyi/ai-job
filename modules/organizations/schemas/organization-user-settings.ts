import type { output } from "zod";
import { boolean, number, object } from "zod";

export const OrganizationUserSettingsSchema = object({
  newApplicationEmailNotifications: boolean(),
  minimumRating: number()
    .int()
    .min(1)
    .max(5)
    .transform(val => (isNaN(val) ? null : val))
    .nullable(),
});

export type OrganizationUserSettingsSchema = output<
  typeof OrganizationUserSettingsSchema
>;
