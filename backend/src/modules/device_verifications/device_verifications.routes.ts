
import { FastifyInstance } from 'fastify';
import { createDeviceVerificationHandler, getDeviceVerificationHandler } from './device_verifications.controller';
import { createInsertSchema } from 'drizzle-zod';
import { deviceVerifications } from './device_verifications.schema';
import { z } from 'zod';
import { $ref } from '../../schemas';

const insertDeviceVerificationSchema = createInsertSchema(deviceVerifications);

export async function deviceVerificationsRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: 'Create a new device verification request',
        description: 'Initiates a new verification process for a device.',
        tags: ['Device Verifications'],
        body: { type: 'object', properties: { deviceVerification: $ref('deviceVerifications') } },
        response: {
          201: {
            description: 'Device verification request created successfully',
            ...$ref('deviceVerifications'),
          },
          400: {
            description: 'Bad request, validation error',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    createDeviceVerificationHandler
  );

  server.get(
    '/:deviceId',
    {
      schema: {
        summary: 'Get device verification status',
        description: 'Retrieves the verification status of a specific device by its ID.',
        tags: ['Device Verifications'],
        params: {
          type: 'object',
          properties: {
            deviceId: {
              type: 'string',
              description: 'The ID of the device to retrieve the verification status for.',
            },
          },
        },
        response: {
          200: {
            description: 'Device verification status',
            ...$ref('deviceVerifications'),
          },
          404: {
            description: 'Device not found',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    getDeviceVerificationHandler
  );
}
