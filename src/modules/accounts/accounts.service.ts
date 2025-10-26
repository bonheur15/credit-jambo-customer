
import { db } from '../../db/db';
import { accounts } from './accounts.schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertAccountSchema = createInsertSchema(accounts);

export type CreateAccountInput = z.infer<typeof insertAccountSchema>;

export async function createAccount(data: CreateAccountInput) {
  const result = await db.insert(accounts).values(data).returning();
  return result[0];
}

export async function findAccountsByUserId(userId: string) {
  const result = await db.select().from(accounts).where(eq(accounts.user_id, userId));
  return result;
}
