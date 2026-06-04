import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  FRONTEND_URL: z.string().url().default("http://localhost:4321"),
});

export const env = envSchema.parse(process.env);
