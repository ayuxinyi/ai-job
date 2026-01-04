import type { output } from "zod";
import { object, string } from "zod";

export const JobListingApplicationSchema = object({
  coverLetter: string()
    .transform(v => (v?.trim() === "" ? null : v))
    .nullable(),
});
export type JobListingApplicationSchema = output<
  typeof JobListingApplicationSchema
>;
