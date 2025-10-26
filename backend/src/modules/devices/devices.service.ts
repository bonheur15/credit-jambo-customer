
import { db } from '../../db/db';
import { devices } from './devices.schema';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertDeviceSchema = createInsertSchema(devices);

export type CreateDeviceInput = z.infer<typeof insertDeviceSchema>;

export async function createDevice(data: CreateDeviceInput) {
  const result = await db.insert(devices).values(data).returning();
  return result[0];
}

export async function findDeviceByDeviceId(deviceId: string) {
  const result = await db.select().from(devices).where(eq(devices.device_id, deviceId));
  return result[0];
}
