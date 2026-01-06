"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";

import { getAiJobListingSearchResults } from "../../actions/job-listing-ai-search-actions";
import { JobListingAiSearchFormSchema } from "../../schemas/job-listing-ai-search-form";

export const JobListingAiSearchForm = () => {
  const router = useRouter();

  const form = useForm<JobListingAiSearchFormSchema>({
    resolver: zodResolver(JobListingAiSearchFormSchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = async (values: JobListingAiSearchFormSchema) => {
    const results = await getAiJobListingSearchResults(values);
    if (results.error) {
      toast.error(results.message);
      return;
    }

    toast.success("AI 智能搜索成功");
    const params = new URLSearchParams();
    results.jobIds?.forEach(jobId => params.append("jobIds", jobId));
    router.push(`/?${params.toString()}`);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="query"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>关键词 / 职位期望</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="例如：3 年前端开发经验，熟悉 React / Next.js，期望远程或一线城市工作"
                  className="min-h-32"
                />
              </FormControl>
              <FormDescription>
                请描述你的技能背景、工作经验以及期望的岗位方向。
                描述得越具体，AI 推荐的职位匹配度越高 🤖✨
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={form.formState.isSubmitting}
          className="flex justify-center mx-auto"
          type="submit"
        >
          <LoadingSwap
            isLoading={form.formState.isSubmitting}
            loadingText="正在智能搜索中..."
          >
            <SearchIcon />
            开始搜索
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};
