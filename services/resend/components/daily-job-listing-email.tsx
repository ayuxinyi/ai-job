import {
  Button,
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  LOCATION_REQUIREMENTS,
} from "@/constants";
import type { JobListingSelect } from "@/db/schema";
import { formatJobListingBadge, formatLocation, formatWage } from "@/lib/utils";

import tailwindConfig from "../data/tailwind-config";

type JobListing = Pick<
  JobListingSelect,
  | "id"
  | "title"
  | "city"
  | "stateAbbreviation"
  | "type"
  | "wage"
  | "wageInterval"
  | "experienceLevel"
  | "locationRequirement"
> & {
  organizationName: string;
};

interface Props {
  userName: string;
  jobListings: JobListing[];
  serverUrl: string;
}

export default function DailyJobListingEmail({
  userName,
  jobListings,
  serverUrl,
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
            💼 今日岗位精选
          </Heading>
          <Text className="text-center text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-lg">
            您好，{userName}！以下岗位最匹配您的条件 ✨
          </Text>

          <Section>
            {jobListings.map(jobListing => (
              <div
                key={jobListing.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200 p-4 sm:p-5 mb-6"
              >
                {/* 岗位标题 + 类型 */}
                <Text className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                  {jobListing.title}{" "}
                  <span className="text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100">
                    {jobListing.type === "full-time"
                      ? "🔥 全职"
                      : jobListing.type === "part-time"
                        ? "⏰ 兼职"
                        : "🎯 实习"}
                  </span>
                </Text>

                {/* 公司名 + 地点 */}
                <Text className="text-gray-500 dark:text-gray-300 mb-3 text-sm sm:text-base flex items-center gap-1">
                  🏢 {jobListing.organizationName}{" "}
                  {jobListing.city && jobListing.stateAbbreviation
                    ? `· ${jobListing.city}, ${jobListing.stateAbbreviation}`
                    : ""}
                </Text>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {getBadges(jobListing).map((badge, index) => (
                    <div
                      key={index}
                      className={`text-xs sm:text-sm font-semibold px-3 py-1 rounded-full
                        ${
                          index === 0
                            ? "bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
                            : index === 1
                              ? "bg-purple-50 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700"
                              : "bg-orange-50 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border border-orange-200 dark:border-orange-700"
                        }
                      `}
                    >
                      {badge}
                    </div>
                  ))}
                </div>

                {/* 查看详情按钮 */}
                <Button
                  href={`${serverUrl}/job-listings/${jobListing.id}`}
                  className="bg-linear-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg px-4 py-2 w-full sm:w-auto text-center"
                >
                  🔎 查看详情
                </Button>
              </div>
            ))}
          </Section>

          {/* 页脚 */}
          <Text className="text-center text-gray-500 dark:text-gray-400 mt-6 text-xs sm:text-sm">
            💡 提示：保持简历最新，确保收到最匹配的岗位通知！
          </Text>
        </Container>
      </Html>
    </Tailwind>
  );
}

function getBadges(jobListing: JobListing) {
  const badges = [
    formatJobListingBadge(
      LOCATION_REQUIREMENTS,
      jobListing.locationRequirement
    ),
    formatJobListingBadge(JOB_TYPES, jobListing.type),
    formatJobListingBadge(EXPERIENCE_LEVELS, jobListing.experienceLevel),
  ];
  if (jobListing.city || jobListing.stateAbbreviation) {
    badges.push(formatLocation(jobListing.stateAbbreviation, jobListing.city));
  }
  if (jobListing.wage !== null && jobListing.wageInterval !== null) {
    badges.push(formatWage(jobListing.wage, jobListing.wageInterval));
  }
  return badges;
}

DailyJobListingEmail.PreviewProps = {
  jobListings: [
    {
      city: "Omaha",
      stateAbbreviation: "NE",
      title: "Frontend Developer",
      wage: null,
      wageInterval: null,
      experienceLevel: "senior",
      type: "part-time",
      id: crypto.randomUUID(),
      organizationName: "Web Dev Simplified",
      locationRequirement: "in-office",
    },
    {
      city: null,
      stateAbbreviation: null,
      title: "Software Engineer",
      wage: 100000,
      wageInterval: "yearly",
      experienceLevel: "mid-level",
      type: "full-time",
      id: crypto.randomUUID(),
      organizationName: "Google",
      locationRequirement: "remote",
    },
  ],
  userName: "张三",
  serverUrl: "http://localhost:3000",
} satisfies Parameters<typeof DailyJobListingEmail>[0];
