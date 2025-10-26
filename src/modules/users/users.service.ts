
import { db } from '../../db/db';
import { users } from './users.schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertUserSchema = createInsertSchema(users);

export type CreateUserInput = z.infer<typeof insertUserSchema>;

export async function createUser(data: CreateUserInput) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function findUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}
