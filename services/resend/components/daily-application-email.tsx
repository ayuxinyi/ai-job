import {
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

import type { JobListingApplicationSelectSchema } from "@/db/schema";
import { cn } from "@/lib/utils";

import tailwindConfig from "../data/tailwind-config";

type Application = Pick<JobListingApplicationSelectSchema, "rating"> & {
  userName: string;
  organizationName: string;
  organizationId: string;
  jobListingId: string;
  jobListingTitle: string;
};

interface Props {
  userName: string;
  applications: Application[];
}

export default function DailyApplicationEmail({
  userName,
  applications,
}: Props) {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Container className="font-sans bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
          {/* 标题 */}
          <Heading
            as="h1"
            className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-2"
          >
            💼 今日岗位申请通知
          </Heading>
          <Text className="text-center text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-lg">
            您好，{userName}！以下是符合该岗位的应聘者 ✨
          </Text>
          {Object.entries(
            Object.groupBy(applications, app => app.organizationId)
          ).map(([orgId, orgApplication], index) => {
            if (!orgApplication || orgApplication.length === 0) return null;
            return (
              <OrganizationSection
                key={orgId}
                orgName={orgApplication[0].organizationName}
                applications={orgApplication}
                noMargin={index === 0}
              />
            );
          })}
          {/* 页脚 */}
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-6 text-xs sm:text-sm">
            💡 提示：保持简历最新，确保收到最匹配的岗位通知！
          </Text>
        </Container>
      </Html>
    </Tailwind>
  );
}

const OrganizationSection = ({
  orgName,
  applications,
  noMargin = false,
}: {
  orgName: string;
  applications: Application[];
  noMargin?: boolean;
}) => {
  return (
    <Section className={noMargin ? undefined : "mt-8"}>
      <Heading as="h2" className="leading-none font-semibold text-3xl my-4">
        {orgName}
      </Heading>
      {Object.entries(
        Object.groupBy(applications, app => app.jobListingId)
      ).map(([jobListingId, listingApplications], i) => {
        if (!listingApplications || listingApplications.length === 0)
          return null;
        return (
          <JobListingCard
            key={jobListingId}
            jobListingTitle={listingApplications[0].jobListingTitle}
            applications={listingApplications}
            noMargin={i === 0}
          />
        );
      })}
    </Section>
  );
};

const JobListingCard = ({
  jobListingTitle,
  applications,
  noMargin = false,
}: {
  jobListingTitle: string;
  applications: Application[];
  noMargin?: boolean;
}) => {
  return (
    <Section
      className={cn(
        "bg-card text-card-foreground rounded-lg border p-4 border-primary border-solid",
        !noMargin && "mt-6"
      )}
    >
      <Heading
        as="h3"
        className="leading-none font-semibold text-2xl mt-0 mb-3"
      >
        {jobListingTitle}
      </Heading>
      {applications.map((application, index) => (
        <Text key={index} className="mt-2 mb-0">
          <span>{application.userName}:</span>
          <RatingIcons rating={application.rating} />
        </Text>
      ))}
    </Section>
  );
};

const RatingIcons = ({ rating }: { rating: number | null }) => {
  if (!rating || rating < 1 || rating > 5) return "评分无效";
  const stars: ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className="w-3 -mb-1.75 mr-0.5">
        {rating >= i ? "★" : "☆"}
      </span>
    );
  }

  return stars;
};

DailyApplicationEmail.PreviewProps = {
  applications: [
    {
      organizationId: "org-1",
      organizationName: "Web Dev Simplified",
      jobListingId: "job-listing-1",
      jobListingTitle: "Software Engineer",
      rating: 2,
      userName: "Larry Cook",
    },
    {
      organizationId: "org-1",
      organizationName: "Web Dev Simplified",
      jobListingId: "job-listing-1",
      jobListingTitle: "Software Engineer",
      rating: 4,
      userName: "Jane Smith",
    },
    {
      organizationId: "org-1",
      organizationName: "Web Dev Simplified",
      jobListingId: "job-listing-2",
      jobListingTitle: "Backend Developer",
      rating: null,
      userName: "Jane Smith",
    },
    {
      organizationId: "org-2",
      organizationName: "Tech Innovations",
      jobListingId: "job-listing-3",
      jobListingTitle: "Frontend Developer",
      rating: 4,
      userName: "Jane Smith",
    },
  ],
  userName: "张三",
} satisfies Parameters<typeof DailyApplicationEmail>[0];
