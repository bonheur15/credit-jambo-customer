
import { FastifyInstance } from 'fastify';
import { registerDeviceHandler } from './devices.controller';
import { createInsertSchema } from 'drizzle-zod';
import { devices } from './devices.schema';

const insertDeviceSchema = createInsertSchema(devices);

export async function devicesRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: 'Register a new device',
        tags: ['Devices'],
        body: insertDeviceSchema,
        response: {
          201: insertDeviceSchema,
        },
      },
    },
    registerDeviceHandler
  );
}
