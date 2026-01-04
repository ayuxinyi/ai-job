import type { output } from "zod";
import { enum as enum_, literal, object, string } from "zod";

import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
} from "@/db/schema";
export const ANY_VALUE = "any";

export const JobListingFilterSchema = object({
  title: string().optional(),
  city: string().optional(),
  stateAbbreviation: string().or(literal(ANY_VALUE)).optional(),
  experienceLevel: enum_(experienceLevels).or(literal(ANY_VALUE)).optional(),
  type: enum_(jobListingTypes).or(literal(ANY_VALUE)).optional(),
  locationRequirement: enum_(locationRequirements)
    .or(literal(ANY_VALUE))
    .optional(),
});

export type JobListingFilterSchema = output<typeof JobListingFilterSchema>;
