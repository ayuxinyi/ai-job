"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { LoadingSwap } from "@/components/app/loading-swap";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  CHINA_PROVINCES,
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  LOCATION_REQUIREMENTS,
  NONE_SELECT_VALUE,
  WAGE_INTERVALS,
} from "@/constants";

import { createJobListing } from "../../actions/job-listing.action";
import { JobListingSchema } from "../../schemas/job-listing.schema";
import { MarkdownEditor } from "./markdown-editor";

export const JobListingForm = () => {
  const form = useForm<JobListingSchema>({
    resolver: zodResolver(JobListingSchema),
    defaultValues: {
      title: "",
      description: "",
      stateAbbreviation: null,
      city: null,
      wage: null,
      wageInterval: null,
      experienceLevel: "junior",
      type: "full-time",
      locationRequirement: "in-office",
    },
  });

  const onSubmit = async (values: JobListingSchema) => {
    const res = await createJobListing(values);
    if (res.error) {
      toast.error(res.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        // @container，表单会根据容器宽度自动调整宽度
        className="space-y-6 @container"
      >
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>岗位标题</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="请输入要发布的岗位标题，如：前端开发工程师"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>岗位薪资</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? 0}
                      type="number"
                      className="rounded-r-none"
                      onChange={e =>
                        field.onChange(
                          isNaN(e.target.valueAsNumber)
                            ? null
                            : e.target.valueAsNumber
                        )
                      }
                      placeholder="请输入岗位薪资，薪资必须为整数，如：5000"
                    />
                  </FormControl>
                  <FormField
                    control={form.control}
                    name="wageInterval"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          {...field}
                          value={field.value ?? ""}
                          onValueChange={val => field.onChange(val ?? null)}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-l-none">
                              <SelectValue placeholder="薪资间隔" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {WAGE_INTERVALS.map(wage => (
                              <SelectItem key={wage.value} value={wage.value}>
                                {wage.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
                <FormDescription>
                  薪资间隔(可选)表示岗位薪资的计算方式，如：年薪、月薪等
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <div className="grid grid-cols-1 @xs:grid-cols-2 gap-x-4 gap-y-6 items-start">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>工作城市</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="请输入要工作的城市，如：北京"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stateAbbreviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>工作省份</FormLabel>
                  <Select
                    {...field}
                    value={field.value ?? ""}
                    onValueChange={val =>
                      field.onChange(val === NONE_SELECT_VALUE ? null : val)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="工作省份" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {field.value && (
                        <SelectItem
                          value={NONE_SELECT_VALUE}
                          className="text-muted-foreground"
                        >
                          清除
                        </SelectItem>
                      )}
                      {CHINA_PROVINCES.map(city => (
                        <SelectItem key={city.pinyin} value={city.abbr}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="locationRequirement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>工作地点</FormLabel>
                <Select
                  {...field}
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="请选择工作地点" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-4 gap-y-6 items-start">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>岗位类型</FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="请选择岗位类型" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {JOB_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>岗位水平</FormLabel>
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="请选择岗位水平" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>岗位描述</FormLabel>
              <FormControl>
                <MarkdownEditor {...field} markdown={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          type="submit"
          className=" mx-auto flex"
        >
          <LoadingSwap
            isLoading={form.formState.isSubmitting}
            loadingText="发布中..."
          >
            <>
              <SendIcon />
              发布岗位
            </>
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};
