
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core';
import { devices } from '../devices/devices.schema';

export const deviceVerifications = pgTable('device_verifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  device_id: uuid('device_id').references(() => devices.id),
  admin_id: uuid('admin_id'),
  status: text('status'), // 'PENDING' | 'VERIFIED' | 'REJECTED'
  created_at: timestamp('created_at').defaultNow(),
  note: text('note'),
});
