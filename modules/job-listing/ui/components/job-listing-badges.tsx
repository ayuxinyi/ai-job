import {
  BanknoteIcon,
  Building2Icon,
  GraduationCapIcon,
  HourglassIcon,
  MapPinIcon,
} from "lucide-react";
import type { ComponentProps, FC } from "react";

import { Badge } from "@/components/ui/badge";
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  LOCATION_REQUIREMENTS,
} from "@/constants";
import type { JobListing } from "@/db/schema";
import {
  cn,
  formatJobListingBadge,
  formatLocation,
  formatWage,
} from "@/lib/utils";

interface Props {
  jobListing: Pick<
    JobListing,
    | "wage"
    | "wageInterval"
    | "city"
    | "stateAbbreviation"
    | "type"
    | "isFeatured"
    | "locationRequirement"
    | "experienceLevel"
  >;
  className?: string;
}

export const JobListingBadges: FC<Props> = ({
  jobListing: {
    wage,
    wageInterval,
    city,
    stateAbbreviation,
    type,
    isFeatured,
    locationRequirement,
    experienceLevel,
  },
  className,
}) => {
  const badgeProps = {
    variant: "outline",
    className,
  } satisfies ComponentProps<typeof Badge>;
  return (
    <>
      {!isFeatured && (
        <Badge
          {...badgeProps}
          className={cn(
            className,
            "border-featured bg-featured/50 text-featured-foreground"
          )}
        >
          精选岗位
        </Badge>
      )}
      {wage && wageInterval && (
        <Badge {...badgeProps}>
          <BanknoteIcon />
          {formatWage(wage, wageInterval)}
        </Badge>
      )}
      {(stateAbbreviation || city) && (
        <Badge {...badgeProps}>
          <MapPinIcon className="size-10" />
          {formatLocation(stateAbbreviation, city)}
        </Badge>
      )}
      <Badge {...badgeProps}>
        <Building2Icon className="size-10" />
        {formatJobListingBadge(LOCATION_REQUIREMENTS, locationRequirement)}
      </Badge>
      <Badge {...badgeProps}>
        <HourglassIcon className="size-10" />
        {formatJobListingBadge(JOB_TYPES, type)}
      </Badge>
      <Badge {...badgeProps}>
        <GraduationCapIcon className="size-10" />
        {formatJobListingBadge(EXPERIENCE_LEVELS, experienceLevel)}
      </Badge>
    </>
  );
};
