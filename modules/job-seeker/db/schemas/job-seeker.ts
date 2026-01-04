import type { output } from "zod";
import { array, enum as enum_, object, string, union } from "zod";

import {
  experienceLevels,
  jobListingTypes,
  locationRequirements,
} from "@/db/schema";

export const SearchSchema = object({
  // catch:当校验失败时，返回undefined
  title: string().optional().catch(undefined),
  city: string().optional().catch(undefined),
  state: string().optional().catch(undefined),
  experience: enum_(experienceLevels).optional().catch(undefined),
  locationRequirement: enum_(locationRequirements).optional().catch(undefined),
  type: enum_(jobListingTypes).optional().catch(undefined),
  jobIds: union([string(), array(string())])
    .transform(v => (Array.isArray(v) ? v : [v]))
    .optional()
    .catch([]),
});

export type SearchSchema = output<typeof SearchSchema>;
