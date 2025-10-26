
import { pgTable, text, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from '../users/users.schema';

export const devices = pgTable('devices', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id').references(() => users.id),
  device_id: text('device_id').notNull(),
  device_meta: jsonb('device_meta'),
  registered_at: timestamp('registered_at').defaultNow(),
  created_by: text('created_by'),
});
