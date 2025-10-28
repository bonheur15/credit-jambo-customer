import type { Config } from "drizzle-kit";

export default {
  schema: "./src/modules/**/!(*.test).schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
