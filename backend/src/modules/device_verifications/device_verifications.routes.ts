
import { FastifyInstance } from 'fastify';
import { createDeviceVerificationHandler, getDeviceVerificationHandler } from './device_verifications.controller';
import { createInsertSchema } from 'drizzle-zod';
import { deviceVerifications } from './device_verifications.schema';
import { z } from 'zod';

const insertDeviceVerificationSchema = createInsertSchema(deviceVerifications);

export async function deviceVerificationsRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: "Create a new device verification",
        description: "Create a new device verification request",
        tags: ["Device Verifications"],
      },
      body: insertDeviceVerificationSchema,
      response: {
        201: insertDeviceVerificationSchema,
      },
    },
    createDeviceVerificationHandler
  );

  server.get(
    '/:deviceId',
    {
      schema: {
        summary: "Get device verification by device id",
        description: "Get device verification status by device id",
        tags: ["Device Verifications"],
        params: z.object({
          deviceId: z.string().uuid(),
        }),
      },
      response: {
        200: insertDeviceVerificationSchema,
      },
    },
    getDeviceVerificationHandler
  );
}
