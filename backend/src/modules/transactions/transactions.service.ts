
import { db } from '../../db/db';
import { transactions } from './transactions.schema';
import { eq, sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { InsufficientFundsError } from '../../utils/errors';

const insertTransactionSchema = createInsertSchema(transactions, {
  amount: z.union([z.string(), z.number()]),
});

export type CreateTransactionInput = z.infer<typeof insertTransactionSchema>;

async function getAccountBalance(accountId: string): Promise<number> {
  const query = sql`
    WITH latest_snapshot AS (
      SELECT balance, last_tx_id FROM account_balance_snapshots
      WHERE account_id = ${accountId}
      ORDER BY created_at DESC
      LIMIT 1
    ),
    sum_after AS (
      SELECT COALESCE(SUM(CASE WHEN type='DEPOSIT' THEN amount WHEN type='WITHDRAWAL' THEN -amount END),0) as delta
      FROM transactions
      WHERE account_id = ${accountId}
        AND (created_at > (SELECT created_at FROM transactions WHERE id = (SELECT last_tx_id FROM latest_snapshot) LIMIT 1) OR (SELECT last_tx_id FROM latest_snapshot) IS NULL)
    )
    SELECT (COALESCE((SELECT balance FROM latest_snapshot),0) + (SELECT delta FROM sum_after)) as balance;
  `;
  const result: Array<{ balance: string | null }> = await db.execute(query);
  if (!result || result.length === 0 || !result[0] || result[0].balance === null) {
    return 0;
  }
  return parseFloat(result[0].balance as string);
}

export async function createTransaction(data: CreateTransactionInput) {
  const transactionData = {
    ...data,
    amount: typeof data.amount === 'number' ? data.amount.toFixed(2) : data.amount,
  };

  if (data.type === 'WITHDRAWAL') {
    return db.transaction(async (tx) => {
      const balance = await getAccountBalance(data.account_id);
      const withdrawalAmount = parseFloat(transactionData.amount);

      if (balance < withdrawalAmount) {
        throw new InsufficientFundsError('Insufficient funds');
      }
      const result = await tx.insert(transactions).values(transactionData).returning();
      return result[0];
    }, { isolationLevel: 'serializable' });
  } else {
    const result = await db.insert(transactions).values(transactionData).returning();
    return result[0];
  }
}

export async function findTransactionsByAccountId(accountId: string, limit?: number) {
  const query = db.select().from(transactions).where(eq(transactions.account_id, accountId));

  if (limit) {
    query.limit(limit);
  }

  const result = await query;
  return result;
}
