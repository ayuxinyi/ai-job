import { UTApi } from "uploadthing/server";

import env from "@/utils/env";
export const uploadthing = new UTApi({ token: env.UPLOADTHING_TOKEN });
