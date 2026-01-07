import { subDays } from "date-fns";
import { and, eq, gte } from "drizzle-orm";
import type { GetEvents } from "inngest";

import db from "@/db/db";
import {
  JobListingApplicationsTable,
  JobListingsTable,
  OrganizationUserSettingsTable,
  UserNotificationSettingsTable,
} from "@/db/schema";
import { resend } from "@/services/resend/client";
import DailyApplicationEmail from "@/services/resend/components/daily-application-email";
import DailyJobListingEmail from "@/services/resend/components/daily-job-listing-email";
import env from "@/utils/env";

import { getMatchingJobListings } from "../ai/get-matching-job-listings";
import { inngest } from "../client";

export const prepareDailyUserJobListingNotifications = inngest.createFunction(
  {
    id: "prepare-daily-user-job-listing-notifications",
    name: "Prepare Daily User Job Listing Notifications",
  },
  {
    cron: "TZ=Asia/Shanghai 0 7 * * *",
  },
  async ({ event, step }) => {
    const getUsers = step.run("get-users", async () => {
      return await db.query.UserNotificationSettingsTable.findMany({
        where: eq(UserNotificationSettingsTable.newJobEmailNotifications, true),
        columns: {
          userId: true,
          newJobEmailNotifications: true,
          aiPrompt: true,
        },
        with: {
          user: {
            columns: {
              email: true,
              name: true,
            },
          },
        },
      });
    });

    const getJobListings = step.run("get-job-listings", async () => {
      return await db.query.JobListingsTable.findMany({
        where: and(
          // gte 查询的是上一天的数据，也就是今天之前发布的数据
          gte(
            JobListingsTable.postedAt,
            subDays(new Date(event.ts ?? Date.now()), 1)
          ),
          eq(JobListingsTable.status, "published")
        ),
        columns: {
          createdAt: false,
          postedAt: false,
          updatedAt: false,
          status: false,
          organizationId: false,
        },
        with: {
          organization: {
            columns: {
              name: true,
            },
          },
        },
      });
    });

    const [userNotifications, jobListings] = await Promise.all([
      getUsers,
      getJobListings,
    ]);
    if (jobListings.length === 0 || userNotifications.length === 0) return;

    const events = userNotifications.map(notification => {
      return {
        name: "app/email.daily-user-job-listings",
        data: {
          aiPrompt: notification.aiPrompt ?? undefined,
          jobListings: jobListings.map(jobListing => {
            return {
              ...jobListing,
              organizationName: jobListing.organization.name,
            };
          }),
        },
        user: {
          email: notification.user.email,
          name: notification.user.name,
        },
      } as const satisfies GetEvents<
        typeof inngest
      >["app/email.daily-user-job-listings"];
    });

    await step.sendEvent("send-emails", events);
  }
);

export const sendDailyUserJobListingEmail = inngest.createFunction(
  {
    id: "send-daily-user-job-listing-email",
    name: "Send Daily User Job Listing Email",
    throttle: {
      limit: 10,
      period: "1m",
    },
  },
  { event: "app/email.daily-user-job-listings" },
  async ({ event, step }) => {
    const { jobListings, aiPrompt } = event.data;
    const user = event.user;
    if (jobListings.length === 0) return null;

    let matchingJobListings: typeof jobListings = [];
    if (!aiPrompt || aiPrompt?.trim() === "") {
      matchingJobListings = jobListings;
    } else {
      const matchIds = await getMatchingJobListings(aiPrompt, jobListings);
      matchingJobListings = jobListings.filter(jobListing =>
        matchIds.includes(jobListing.id)
      );
    }
    if (matchingJobListings.length === 0) return;
    // 发送邮件
    await step.run("send-email", async () => {
      await resend.emails.send({
        // 由谁发送
        from: "每日邮件 <onboarding@resend.dev>",
        // 发送给谁
        to: "yxywebcode@gmail.com",
        // 邮件标题
        subject: "每日邮件通知",
        // 邮件内容
        react: DailyJobListingEmail({
          jobListings: matchingJobListings,
          userName: user.name,
          serverUrl: env.SERVER_URL,
        }),
      });
    });
  }
);

export const prepareDailyOrganizationUserApplicationNotifications =
  inngest.createFunction(
    {
      id: "prepare-daily-organization-user-application-notifications",
      name: "Prepare Daily Organization User Application Notifications",
    },
    {
      cron: "TZ=Asia/Shanghai 0 7 * * *",
    },
    async ({ step, event }) => {
      const getOrganizations = step.run("get-organizations", async () => {
        return await db.query.OrganizationUserSettingsTable.findMany({
          where: eq(
            OrganizationUserSettingsTable.newApplicationEmailNotifications,
            true
          ),
          columns: {
            userId: true,
            organizationId: true,
            newApplicationEmailNotifications: true,
            minimumRating: true,
          },
          with: {
            user: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
        });
      });
      const getJobApplications = step.run("get-job-applications", async () => {
        return await db.query.JobListingApplicationsTable.findMany({
          where: and(
            gte(
              JobListingApplicationsTable.createdAt,
              subDays(new Date(event.ts ?? Date.now()), 1)
            )
          ),
          columns: {
            rating: true,
          },
          with: {
            user: {
              columns: {
                name: true,
              },
            },
            jobListing: {
              columns: {
                id: true,
                title: true,
              },
              with: {
                organization: {
                  columns: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });
      });

      const [organizationsNotifications, jobApplications] = await Promise.all([
        getOrganizations,
        getJobApplications,
      ]);
      if (
        organizationsNotifications.length === 0 ||
        jobApplications.length === 0
      )
        return;

      const groupNotifications = Object.groupBy(
        organizationsNotifications,
        n => n.userId
      );
      const events = Object.entries(groupNotifications)
        .map(([, settings]) => {
          if (!settings || settings.length === 0) return null;
          const userName = settings[0].user.name;
          const userEmail = settings[0].user.email;

          const filterApplications = jobApplications
            .filter(app => {
              return settings.find(
                s =>
                  s.organizationId === app.jobListing.organization.id &&
                  (s.minimumRating === null ||
                    (app.rating ?? 0) >= s.minimumRating)
              );
            })
            .map(app => ({
              organizationId: app.jobListing.organization.id,
              organizationName: app.jobListing.organization.name,
              jobListingId: app.jobListing.id,
              jobListingTitle: app.jobListing.title,
              userName: app.user.name,
              rating: app.rating,
            }));
          if (filterApplications.length === 0) return null;
          return {
            name: "app/email.daily-organization-user-application",
            user: {
              name: userName,
              email: userEmail,
            },
            data: {
              applications: filterApplications,
            },
          } as const satisfies GetEvents<
            typeof inngest
          >["app/email.daily-organization-user-application"];
        })
        .filter(v => v !== null);
      await step.sendEvent("send-emails", events);
    }
  );

export const sendDailyOrganizationUserApplicationEmail = inngest.createFunction(
  {
    id: "send-daily-organization-user-application-email",
    name: "Send Daily Organization User Application Email",
    throttle: {
      limit: 1000,
      period: "1m",
    },
  },
  { event: "app/email.daily-organization-user-application" },
  async ({ event, step }) => {
    const { applications } = event.data;
    const user = event.user;
    if (applications.length === 0) return null;

    // 发送邮件
    await step.run("send-email", async () => {
      await resend.emails.send({
        // 由谁发送
        from: "岗位申请通知 <onboarding@resend.dev>",
        // 发送给谁
        to: "yxywebcode@gmail.com",
        // 邮件标题
        subject: "岗位申请通知",
        // 邮件内容
        react: DailyApplicationEmail({
          applications,
          userName: user.name,
        }),
      });
    });
  }
);
