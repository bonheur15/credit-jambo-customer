
import { pgTable, uuid, numeric, timestamp, bigserial } from 'drizzle-orm/pg-core';
import { accounts } from '../accounts/accounts.schema';

export const accountBalanceSnapshots = pgTable('account_balance_snapshots', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  account_id: uuid('account_id').references(() => accounts.id),
  balance: numeric('balance', { precision: 18, scale: 2 }).notNull(),
  last_tx_id: uuid('last_tx_id'),
  created_at: timestamp('created_at').defaultNow(),
});
