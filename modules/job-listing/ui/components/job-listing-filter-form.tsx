"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { LoadingSwap } from "@/components/app/loading-swap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSidebar } from "@/components/ui/sidebar";
import {
  CHINA_PROVINCES,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  LOCATION_REQUIREMENTS,
} from "@/constants";
import type {
  experienceLevel,
  jobListingType,
  locationRequirement,
} from "@/db/schema";

import {
  ANY_VALUE,
  JobListingFilterSchema,
} from "../../schemas/job-listing-filter.schema";

export const JobListingFilterForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const form = useForm<JobListingFilterSchema>({
    resolver: zodResolver(JobListingFilterSchema),
    defaultValues: {
      title: searchParams.get("title") ?? "",
      city: searchParams.get("city") ?? "",
      stateAbbreviation: searchParams.get("state") ?? "",
      experienceLevel:
        (searchParams.get("experience") as experienceLevel) ?? ANY_VALUE,
      type: (searchParams.get("type") as jobListingType) ?? ANY_VALUE,
      locationRequirement:
        (searchParams.get("locationRequirement") as locationRequirement) ??
        ANY_VALUE,
    },
  });

  const onSubmit = (value: JobListingFilterSchema) => {
    const newParams = new URLSearchParams();
    if (value.city) newParams.set("city", value.city);
    if (value.stateAbbreviation && value.stateAbbreviation !== ANY_VALUE) {
      newParams.set("state", value.stateAbbreviation);
    }
    if (value.experienceLevel && value.experienceLevel !== ANY_VALUE) {
      newParams.set("experience", value.experienceLevel);
    }
    if (value.type && value.type !== ANY_VALUE) {
      newParams.set("type", value.type);
    }
    if (value.locationRequirement && value.locationRequirement !== ANY_VALUE) {
      newParams.set("locationRequirement", value.locationRequirement);
    }
    if (value.title) newParams.set("title", value.title);
    router.push(`${pathname}?${newParams.toString()}`);
    setOpenMobile(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>岗位标题</FormLabel>
              <FormControl>
                <Input {...field} placeholder="如：前端工程师" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="locationRequirement"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>工作地点</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择工作地点" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>任意地点</SelectItem>
                  {LOCATION_REQUIREMENTS.map(req => (
                    <SelectItem key={req.value} value={req.value}>
                      {req.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>工作城市</FormLabel>
              <FormControl>
                <Input {...field} placeholder="如：北京" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="stateAbbreviation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>工作省份</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择工作省份" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>任意省份</SelectItem>
                  {CHINA_PROVINCES.map(province => (
                    <SelectItem key={province.pinyin} value={province.abbr}>
                      {province.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="experienceLevel"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>工作经验</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择工作经验" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>任意经验</SelectItem>
                  {EXPERIENCE_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          name="type"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>工作类型</FormLabel>
              <Select value={field.value ?? ""} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择工作类型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={ANY_VALUE}>任意类型</SelectItem>
                  {JOB_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          <LoadingSwap
            isLoading={form.formState.isSubmitting}
            loadingText="筛选中..."
          >
            <SearchIcon className="size-4" />
            筛选职位
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};
