"use client";
import { type ComponentProps, type FC, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { LoadingSwap } from "./loading-swap";

type Props = {
  action: () => Promise<{ error: boolean; message?: string }>;
  requireAreYouSure?: boolean;
  areYouSureDescription?: string;
} & Omit<ComponentProps<typeof Button>, "onClick">;

export const ActionButton: FC<Props> = ({
  action,
  requireAreYouSure = false,
  areYouSureDescription = "该操作将无法撤销,是否继续?",
  ...props
}) => {
  const [isLoading, startTransition] = useTransition();

  const performAction = () => {
    startTransition(async () => {
      const data = await action();
      if (data.error) {
        toast.error(data.message || "很抱歉，由于未知原因，操作失败");
      }
    });
  };

  if (requireAreYouSure) {
    return (
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>您确定要执行此操作吗？</AlertDialogTitle>
            <AlertDialogDescription>
              {areYouSureDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取 消</AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={performAction}>
              <LoadingSwap isLoading={isLoading} loadingText="操作中...">
                确 认
              </LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button {...props} disabled={isLoading} onClick={performAction}>
      <LoadingSwap
        isLoading={isLoading}
        className="inline-flex items-center gap-2"
        loadingText="操作中..."
      >
        {props.children}
      </LoadingSwap>
    </Button>
  );
};
