type CacheTag =
  | "users"
  | "organizations"
  | "jobListings"
  | "userNotificationSettings"
  | "userResumes"
  | "jobListingApplications"
  | "organizationUserSettings";

export function getGlobalTag(tag: CacheTag) {
  return `global:${tag}` as const;
}

export function getJobListingApplicationTag(tag: CacheTag, id: string) {
  return `jobListing:${id}-${tag}` as const;
}

export function getOrganizationTag(tag: CacheTag, orgId: string) {
  return `organization:${orgId}-${tag}` as const;
}

export function getIdTag(tag: CacheTag, id: string) {
  return `id:${id}-${tag}` as const;
}
