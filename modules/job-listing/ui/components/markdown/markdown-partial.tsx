"use client";
import {
  type FC,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  // 全部markdown，当内容超过指定高度后，点击显示全部按钮，显示全部内容
  dialogMarkdown: ReactNode;
  // 主要markdown，当内容超过指定高度后，截断显示
  mainMarkdown: ReactNode;
  // 对话框标题
  dialogTitle: string;
}

export const MarkdownPartial: FC<Props> = ({
  dialogMarkdown,
  mainMarkdown,
  dialogTitle,
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const markdownRef = useRef<HTMLDivElement | null>(null);

  // 检查是否溢出
  const checkOverflow = (node: HTMLDivElement) => {
    setIsOverflowing(node.scrollHeight > node.clientHeight);
  };

  // useEffect，用于给window添加resize事件监听
  useEffect(() => {
    const controller = new AbortController();
    window.addEventListener(
      "resize",
      () => {
        if (!markdownRef.current) return;
        checkOverflow(markdownRef.current);
      },
      {
        signal: controller.signal,
      }
    );
    return () => {
      controller.abort();
    };
  }, []);

  // useLayoutEffect 用于在页面完全渲染完成后检查是否溢出
  useLayoutEffect(() => {
    if (!markdownRef.current) return;
    checkOverflow(markdownRef.current);
  }, []);

  return (
    <>
      <div ref={markdownRef} className="max-h-75 overflow-hidden relative">
        {mainMarkdown}
        {isOverflowing && (
          // to-15%，代表颜色渐变到距离顶部15%的位置时结束渐变，颜色变为透明
          <div className="bg-linear-to-t from-background to-transparent to-15% inset-0 absolute pointer-events-none" />
        )}
      </div>
      {isOverflowing && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="underline -ml-3">
              查看更多
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-3xl lg:max-w-4xl max-h-[calc(100%-2rem)] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">{dialogMarkdown}</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
