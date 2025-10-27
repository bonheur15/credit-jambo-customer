import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  name: text("name"),
  created_at: timestamp("created_at").defaultNow(),
  role: text("role").default("client").notNull(),
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").references(() => users.id).notNull(),
  device_id: text("device_id").notNull(),
  token_hash: text("token_hash").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  revoked_at: timestamp("revoked_at"),
});
