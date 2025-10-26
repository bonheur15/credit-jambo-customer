
import { db } from '../../db/db';
import { transactions } from './transactions.schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertTransactionSchema = createInsertSchema(transactions);

export type CreateTransactionInput = z.infer<typeof insertTransactionSchema>;

export async function createTransaction(data: CreateTransactionInput) {
  const result = await db.insert(transactions).values(data).returning();
  return result[0];
}

export async function findTransactionsByAccountId(accountId: string) {
  const result = await db.select().from(transactions).where(eq(transactions.account_id, accountId));
  return result;
}
