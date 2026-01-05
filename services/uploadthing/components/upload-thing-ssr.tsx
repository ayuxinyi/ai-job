import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { connection } from "next/server";
import { Suspense } from "react";
import { extractRouterConfig } from "uploadthing/server";

import { customFileRouter } from "../router";

const UTSSR = async () => {
  await connection();
  return <NextSSRPlugin routerConfig={extractRouterConfig(customFileRouter)} />;
};

export const UploadThingSSR = () => {
  return (
    <Suspense>
      <UTSSR />
    </Suspense>
  );
};
