import { db } from "../../db/db";
import { accounts } from "./accounts.schema";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  const result = await db
    .select()
    .from(accounts)
    .where(eq(accounts.user_id, userId));
  return result;
}

import { sql } from "drizzle-orm";

type BalanceQueryResult = {
  [key: string]: unknown;
  account_id: string;
  balance: string;
  currency: string;
  last_snapshot_at: string | null;
}

export async function getAccountBalance(
  accountId: string,
): Promise<BalanceDTO | undefined> {
  const result = await db.execute<BalanceQueryResult>(sql`
    WITH latest_snapshot AS (
      SELECT
        abs.balance::numeric as snapshot_balance,
        t.created_at as last_tx_timestamp
      FROM account_balance_snapshots abs
      LEFT JOIN transactions t ON t.id = abs.last_tx_id
      WHERE abs.account_id = ${accountId}
      ORDER BY abs.created_at DESC
      LIMIT 1
    ),
    transactions_after AS (
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN type = 'DEPOSIT' THEN amount::numeric
              WHEN type = 'WITHDRAWAL' THEN -amount::numeric
            END
          ),
          0
        ) as delta
      FROM transactions t
      WHERE t.account_id = ${accountId}
        AND (
          t.created_at > (SELECT last_tx_timestamp FROM latest_snapshot WHERE last_tx_timestamp IS NOT NULL)
          OR NOT EXISTS (SELECT 1 FROM latest_snapshot WHERE last_tx_timestamp IS NOT NULL)
        )
    )
    SELECT
      a.id as account_id,
      (COALESCE((SELECT snapshot_balance FROM latest_snapshot), 0) + (SELECT delta FROM transactions_after))::text as balance,
      a.currency,
      (SELECT last_tx_timestamp FROM latest_snapshot) as last_snapshot_at
    FROM accounts a
    WHERE a.id = ${accountId};
  `);

  if (result.length > 0) {
    const row = result[0];
    if (!row) {
      return undefined;
    }
    return {
      account_id: row.account_id,
      balance: parseFloat(row.balance),
      currency: row.currency,
      last_snapshot_at: row.last_snapshot_at
        ? new Date(row.last_snapshot_at)
        : null,
    };
  }

  return undefined;
}
