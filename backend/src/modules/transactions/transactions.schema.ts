
import { pgTable, text, uuid, timestamp, numeric, jsonb } from 'drizzle-orm/pg-core';
import { accounts } from '../accounts/accounts.schema';

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  account_id: uuid('account_id').references(() => accounts.id).notNull(),
  type: text('type').notNull(), // 'DEPOSIT' | 'WITHDRAWAL'
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  reference: text('reference'),
  meta: jsonb('meta'),
  created_at: timestamp('created_at').defaultNow(),
  created_by: uuid('created_by'),
  status: text('status'), // 'PENDING' | 'COMPLETED' | 'FAILED'
});
