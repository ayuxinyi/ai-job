"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon } from "lucide-react";
import type { FC } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RATING_OPTIONS } from "@/constants/rating";
import type { OrganizationUserSettingsSelect } from "@/db/schema";
import { updateOrganizationUserSettings } from "@/modules/organizations/actions/organization-user-settings";
import { OrganizationUserSettingsSchema } from "@/modules/organizations/schemas/organization-user-settings";

import { RatingIcon } from "./rating-icon";

interface Props {
  notificationSettings?: Pick<
    OrganizationUserSettingsSelect,
    "newApplicationEmailNotifications" | "minimumRating"
  >;
}

const ANY_VALUE = "any";

export const NotificationsForm: FC<Props> = ({ notificationSettings }) => {
  const form = useForm<OrganizationUserSettingsSchema>({
    resolver: zodResolver(OrganizationUserSettingsSchema),
    defaultValues: notificationSettings ?? {
      newApplicationEmailNotifications: false,
      minimumRating: null,
    },
  });

  const onSubmit = async (values: OrganizationUserSettingsSchema) => {
    const result = await updateOrganizationUserSettings(values);
    if (result.error) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
  };

  // 监听 newJobEmailNotifications 字段的变化
  const newApplicationEmailNotifications = useWatch({
    control: form.control,
    name: "newApplicationEmailNotifications",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-lg p-4 shadow-sm space-y-6">
          <FormField
            name="newApplicationEmailNotifications"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>每日邮件通知</FormLabel>
                    <FormDescription>
                      开启后，您将通过邮件接收所有新职位申请的汇总通知。
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          {newApplicationEmailNotifications && (
            <FormField
              name="minimumRating"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0.5">
                    <FormLabel>最小评分</FormLabel>
                  </div>
                  <Select
                    value={field.value ? field.value.toString() : ANY_VALUE}
                    onValueChange={val =>
                      field.onChange(val === ANY_VALUE ? null : parseInt(val))
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value === null ? (
                            <span>任何评分</span>
                          ) : (
                            <RatingIcon
                              className="text-inherit"
                              rating={field.value}
                            />
                          )}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ANY_VALUE}>任何评分</SelectItem>
                      {RATING_OPTIONS.filter(r => r !== null).map(rating => (
                        <SelectItem key={rating} value={rating.toString()}>
                          <RatingIcon
                            rating={rating}
                            className="text-inherit"
                          />
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    仅接收评分达到或高于该等级的候选人通知。 3–5
                    星的候选人通常满足岗位核心要求，并且与该职位高度匹配。
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="flex mx-auto"
        >
          <LoadingSwap
            isLoading={form.formState.isSubmitting}
            loadingText="保存中..."
          >
            <SendIcon />
            保存设置
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};
