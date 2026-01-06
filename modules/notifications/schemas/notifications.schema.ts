import type { output } from "zod";
import { boolean, object, string } from "zod";

export const NotificationsFormSchema = object({
  newJobEmailNotifications: boolean(),
  aiPrompt: string()
    .transform(value => (value.trim() === "" ? null : value))
    .nullable(),
});
export type NotificationsFormSchema = output<typeof NotificationsFormSchema>;
