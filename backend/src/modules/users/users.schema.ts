import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  name: text("name"),
  created_at: timestamp("created_at").defaultNow(),
});
