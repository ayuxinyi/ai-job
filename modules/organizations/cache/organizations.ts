import { revalidateTag } from "next/cache";

import { getGlobalTag, getIdTag } from "@/lib/data-cache";

export function getOrganizationGlobalTag() {
  return getGlobalTag("organizations");
}

export function getOrganizationIdTag(orgId: string) {
  return getIdTag("organizations", orgId);
}

export function revalidateOrganizationCache(orgId: string) {
  revalidateTag(getOrganizationGlobalTag(), "max");
  revalidateTag(getOrganizationIdTag(orgId), "max");
}
