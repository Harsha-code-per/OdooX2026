import { z } from "zod";

/**
 * Environment variables schema using Zod.
 * Validates variables at runtime to prevent configuration bugs in production.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
    .default("http://localhost:8000/api/v1"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

// Parse the environment variables safely
const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment configuration.");
}

export const env = parsedEnv.data;
export type Env = z.infer<typeof envSchema>;
