import dynamic from "next/dynamic";

export const MarkdownEditor = dynamic(() => import("./InitializedMDXEditor"), {
  ssr: false,
});
