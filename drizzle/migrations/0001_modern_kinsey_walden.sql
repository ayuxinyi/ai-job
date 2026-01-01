ALTER TABLE "job_listings" ALTER COLUMN "wage_interval" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "job_listings" ALTER COLUMN "wage_interval" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_listings" ALTER COLUMN "state_abbreviation" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_listings" ALTER COLUMN "city" DROP NOT NULL;