"use client";
import "@mdxeditor/editor/style.css";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  headingsPlugin,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import type { Ref } from "react";

import { Separator } from "@/components/ui/separator";
import { MARKDOWN_CLASS_NAMES } from "@/constants/markdown";
import { useIsDarkMode } from "@/hooks/use-is-dark-mode";
import { cn } from "@/lib/utils";

// Only import this to the next file
export default function InitializedMDXEditor({
  ref,
  className,
  ...props
}: { ref?: Ref<MDXEditorMethods> } & MDXEditorProps) {
  const { isDarkMode } = useIsDarkMode();

  return (
    <MDXEditor
      plugins={[
        // 标题插件，用于渲染markdown的标题
        headingsPlugin(),
        // 列表插件，用于渲染markdown的列表
        listsPlugin(),
        // 引用插件，用于渲染markdown的引用
        quotePlugin(),
        //  thematicBreakPlugin，用于渲染markdown的 thematic break
        thematicBreakPlugin(),
        // 快捷键插件，用于渲染markdown的快捷键
        markdownShortcutPlugin(),
        // 表格插件，用于渲染markdown的表格
        tablePlugin(),
        // 链接插件，用于渲染markdown的链接
        linkPlugin(),
        // 链接对话框插件，用于渲染markdown的链接对话框
        linkDialogPlugin(),
        // 工具栏插件，用于渲染markdown的工具栏
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {/* 块类型选择器，用于切换markdown的块类型 */}
              <BlockTypeSelect />
              <Separator orientation="vertical" className="h-5! bg-border" />
              {/* 加粗，斜体，下划线切换 */}
              <BoldItalicUnderlineToggles />
              <Separator orientation="vertical" className="h-5! bg-border" />
              {/* 列表切换 */}
              <ListsToggle />
              <Separator orientation="vertical" className="h-5! bg-border" />
              {/* 插入thematic break */}
              <InsertThematicBreak />
              <Separator orientation="vertical" className="h-5! bg-border" />
              {/* 插入表格 */}
              <InsertTable />
              <Separator orientation="vertical" className="h-5! bg-border" />
              {/* 撤销，重做 */}
              <UndoRedo />
              <Separator orientation="vertical" className="h-5! bg-border" />
              {/* 代码 */}
              <CodeToggle />
            </>
          ),
        }),
      ]}
      {...props}
      ref={ref}
      className={cn(
        MARKDOWN_CLASS_NAMES,
        isDarkMode && "dark-theme",
        className
      )}
      // 禁用html处理，否则会导致markdown的渲染错误
      suppressHtmlProcessing
    />
  );
}
