
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';

export const accounts = pgTable('accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id),
  currency: text('currency').default('RWF'),
  created_at: timestamp('created_at').defaultNow(),
});
