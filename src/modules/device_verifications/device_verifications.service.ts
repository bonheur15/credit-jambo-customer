
import { db } from '../../db/db';
import { deviceVerifications } from './device_verifications.schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertDeviceVerificationSchema = createInsertSchema(deviceVerifications);

export type CreateDeviceVerificationInput = z.infer<typeof insertDeviceVerificationSchema>;

export async function createDeviceVerification(data: CreateDeviceVerificationInput) {
  const result = await db.insert(deviceVerifications).values(data).returning();
  return result[0];
}

export async function findDeviceVerificationByDeviceId(deviceId: string) {
  const result = await db.select().from(deviceVerifications).where(eq(deviceVerifications.device_id, deviceId));
  return result[0];
}
