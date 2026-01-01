import dynamic from "next/dynamic";

export const MarkdownEditor = dynamic(
  () => import("./initialized-mdx-editor"),
  {
    ssr: false,
  }
);
