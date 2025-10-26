
import { pgTable, text, uuid, timestamp, jsonb, bigserial } from 'drizzle-orm/pg-core';

export const auditLogs = pgTable('audit_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  user_id: uuid('user_id'),
  admin_id: uuid('admin_id'),
  action: text('action'),
  meta: jsonb('meta'),
  created_at: timestamp('created_at').defaultNow(),
});
