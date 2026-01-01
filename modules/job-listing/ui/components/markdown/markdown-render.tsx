import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type { FC } from "react";
import remarkGfm from "remark-gfm";

import { MARKDOWN_CLASS_NAMES } from "@/constants/markdown";
import { cn } from "@/lib/utils";

export const MarkdownRender: FC<MDXRemoteProps & { className?: string }> = ({
  className,
  options,
  ...props
}) => {
  return (
    <div className={cn(MARKDOWN_CLASS_NAMES, className)}>
      <MDXRemote
        {...props}
        options={{
          mdxOptions: {
            remarkPlugins: [
              // remarkGfm-使mdx支持github flavored markdown
              remarkGfm,
              ...(options?.mdxOptions?.remarkPlugins ?? []),
            ],
            ...options?.mdxOptions,
          },
        }}
      />
    </div>
  );
};
