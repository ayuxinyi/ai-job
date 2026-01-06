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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { UserNotificationSettingsSelect } from "@/db/schema";
import { updateUserNotificationSettings } from "@/modules/notifications/actions/notifications.action";
import { NotificationsFormSchema } from "@/modules/notifications/schemas/notifications.schema";

interface Props {
  notificationSettings?: Pick<
    UserNotificationSettingsSelect,
    "newJobEmailNotifications" | "aiPrompt"
  >;
}

export const NotificationsForm: FC<Props> = ({ notificationSettings }) => {
  const form = useForm({
    resolver: zodResolver(NotificationsFormSchema),
    defaultValues: notificationSettings ?? {
      newJobEmailNotifications: false,
      aiPrompt: "",
    },
  });

  const onSubmit = async (values: NotificationsFormSchema) => {
    const result = await updateUserNotificationSettings(values);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("通知设置已保存");
  };

  // 监听 newJobEmailNotifications 字段的变化
  const newJobEmailNotifications = useWatch({
    control: form.control,
    name: "newJobEmailNotifications",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-lg p-4 shadow-sm space-y-6">
          <FormField
            name="newJobEmailNotifications"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>每日邮件通知</FormLabel>
                    <FormDescription>
                      开启后，您将每天收到一份与您的兴趣相匹配的最新的职位邮件通知。
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
          {newJobEmailNotifications && (
            <FormField
              name="aiPrompt"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0.5">
                    <FormLabel>筛选条件（AI 智能过滤）</FormLabel>
                    <FormDescription>
                      AI将根据您填写的条件智能筛选职位，只向您推送符合您期望的岗位通知。
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      placeholder="请描述您感兴趣的岗位类型，例如：我想找远程的前端开发岗位，技术栈为 React，薪资在 20k 以上。"
                      className="min-h-32"
                    />
                  </FormControl>
                  <FormDescription>
                    不填写也没关系，您将收到所有新发布职位的提醒。
                  </FormDescription>
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
