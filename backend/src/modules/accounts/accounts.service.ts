
import { db } from '../../db/db';
import { accounts } from './accounts.schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertAccountSchema = createInsertSchema(accounts);

export type CreateAccountInput = z.infer<typeof insertAccountSchema>;

export type BalanceDTO = {
  account_id: string;
  balance: number;
  currency: string;
  last_snapshot_at: Date | null;
};

export async function createAccount(data: CreateAccountInput) {
  const result = await db.insert(accounts).values(data).returning();
  return result[0];
}

export async function findAccountsByUserId(userId: string) {
  const result = await db.select().from(accounts).where(eq(accounts.user_id, userId));
  return result;
}

export async function getAccountBalance(accountId: string): Promise<BalanceDTO | undefined> {
  const query = `
    WITH latest_snapshot AS (
      SELECT balance, last_tx_id, created_at FROM account_balance_snapshots
      WHERE account_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    ),
    sum_after AS (
      SELECT COALESCE(SUM(CASE WHEN type='DEPOSIT' THEN amount WHEN type='WITHDRAWAL' THEN -amount END),0) as delta
      FROM transactions
      WHERE account_id = $1
        AND (created_at > (SELECT created_at FROM transactions WHERE id = (SELECT last_tx_id FROM latest_snapshot) LIMIT 1) OR (SELECT last_tx_id FROM latest_snapshot) IS NULL)
    )
    SELECT 
      $1 as account_id,
      (COALESCE((SELECT balance FROM latest_snapshot),0) + (SELECT delta FROM sum_after)) as balance,
      (SELECT currency FROM accounts WHERE id = $1) as currency,
      (SELECT created_at FROM latest_snapshot) as last_snapshot_at;
  `;

  const result = await db.execute(query, [accountId]);

  if (result.rows.length > 0) {
    const row = result.rows[0];
    return {
      account_id: row.account_id,
      balance: parseFloat(row.balance),
      currency: row.currency,
      last_snapshot_at: row.last_snapshot_at ? new Date(row.last_snapshot_at) : null,
    };
  }

  return undefined;
}
