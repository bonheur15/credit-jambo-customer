
import { db } from '../../db/db';
import { auditLogs } from './audit_logs.schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertAuditLogSchema = createInsertSchema(auditLogs);

export type CreateAuditLogInput = z.infer<typeof insertAuditLogSchema>;

export async function createAuditLog(data: CreateAuditLogInput) {
  const result = await db.insert(auditLogs).values(data).returning();
  return result[0];
}
