
import { pgTable, text, uuid, timestamp, jsonb, bigserial, integer } from 'drizzle-orm/pg-core';

export const events = pgTable('events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  aggregate_type: text('aggregate_type').notNull(),
  aggregate_id: uuid('aggregate_id'),
  event_type: text('event_type').notNull(),
  event_version: integer('event_version').default(1),
  payload: jsonb('payload').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});
