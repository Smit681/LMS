//Zod is a general-purpose schema validation and parsing library.
//Zod: defines the what (rules for validation)

//This is a wrapper around Zod specifically designed for validating .env variables in Next.js apps, at startup, with some extra magic:
//env-nextjs: defines the where/how (run Zod on process.env, infer types, ensure server vs client separation)

import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DB_PASSWORD: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_HOST: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SECRET: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },
  experimental__runtimeEnv: process.env,
});
