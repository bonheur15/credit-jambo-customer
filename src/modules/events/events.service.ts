
import { db } from '../../db/db';
import { events } from './events.schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

const insertEventSchema = createInsertSchema(events);

export type CreateEventInput = z.infer<typeof insertEventSchema>;

export async function createEvent(data: CreateEventInput) {
  const result = await db.insert(events).values(data).returning();
  return result[0];
}
