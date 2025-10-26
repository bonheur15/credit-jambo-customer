
import { FastifyInstance } from 'fastify';
import { createDeviceVerificationHandler, getDeviceVerificationHandler } from './device_verifications.controller';
import { createInsertSchema } from 'drizzle-zod';
import { deviceVerifications } from './device_verifications.schema';

const insertDeviceVerificationSchema = createInsertSchema(deviceVerifications);

export async function deviceVerificationsRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: 'Create a new device verification',
        tags: ['Device Verifications'],
        body: insertDeviceVerificationSchema,
        response: {
          201: insertDeviceVerificationSchema,
        },
      },
    },
    createDeviceVerificationHandler
  );

  server.get(
    '/:deviceId',
    {
      schema: {
        summary: 'Get device verification by device id',
        tags: ['Device Verifications'],
        response: {
          200: insertDeviceVerificationSchema,
        },
      },
    },
    getDeviceVerificationHandler
  );
}
