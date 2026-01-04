import { revalidateTag } from "next/cache";

import {
  getGlobalTag,
  getIdTag,
  getJobListingApplicationTag,
} from "@/lib/data-cache";

export const getJobListingApplicantGlobalTag = () =>
  getGlobalTag("jobListingApplications");

export const getJobListingApplicationJobListingTag = (jobListingId: string) => {
  return getJobListingApplicationTag("jobListingApplications", jobListingId);
};

type IdProps = {
  jobListingId: string;
  userId: string;
};

export const getJobListingApplicationIdTag = ({
  jobListingId,
  userId,
}: IdProps) => getIdTag("jobListingApplications", `${jobListingId}-${userId}`);

export const revalidateJobListingApplicationCache = ({
  jobListingId,
  userId,
}: IdProps) => {
  revalidateTag(getJobListingApplicantGlobalTag(), "max");
  revalidateTag(getJobListingApplicationJobListingTag(jobListingId), "max");
  revalidateTag(getJobListingApplicationIdTag({ jobListingId, userId }), "max");
};
