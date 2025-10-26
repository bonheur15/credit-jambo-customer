
import { FastifyInstance } from 'fastify';
import { registerDeviceHandler } from './devices.controller';
import { createInsertSchema } from 'drizzle-zod';
import { devices } from './devices.schema';
import { $ref } from '../../schemas';

const insertDeviceSchema = createInsertSchema(devices);

export async function devicesRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: 'Register a new device',
        description: 'Registers a new device for a user, typically a mobile phone or a computer.',
        tags: ['Devices'],
        body: { type: 'object', properties: { device: $ref('devices') } },
        response: {
          201: {
            description: 'Device registered successfully',
            ...$ref('devices'),
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
    registerDeviceHandler
  );
}
