"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import type { FC } from "react";
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
import { MarkdownEditor } from "@/modules/job-listing/ui/components/markdown/markdown-editor";

import { createJobListingApplicationAction } from "../../actions/job-listing-applicant.action";
import { JobListingApplicationSchema } from "../../schemas/job-listing-application";

interface Props {
  jobListingId: string;
}

const NewJobListingApplicationForm: FC<Props> = ({ jobListingId }) => {
  const form = useForm<JobListingApplicationSchema>({
    resolver: zodResolver(JobListingApplicationSchema),
    defaultValues: {
      coverLetter: "",
    },
  });

  const onSubmit = async (values: JobListingApplicationSchema) => {
    const results = await createJobListingApplicationAction(
      jobListingId,
      values
    );
    if (results.error) {
      toast.error(results.message);
      return;
    }
    toast.success(results.message);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="coverLetter"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>求职信</FormLabel>
              <FormControl>
                <MarkdownEditor {...field} markdown={field.value ?? ""} />
              </FormControl>
              <FormDescription>可选</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            <SendIcon className="size-4" />申 请
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};
export default NewJobListingApplicationForm;
