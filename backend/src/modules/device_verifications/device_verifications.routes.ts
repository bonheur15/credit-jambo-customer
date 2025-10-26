
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
        summary: 'Create a new device verification request',
        description: 'Initiates a new verification process for a device.',
        tags: ['Device Verifications'],
        body: {
          type: 'object',
          properties: {
            device_id: { type: 'string', format: 'uuid' },
            admin_id: { type: 'string', format: 'uuid' },
            status: { type: 'string', enum: ['PENDING', 'VERIFIED', 'REJECTED'] },
            note: { type: 'string' },
          },
          required: ['device_id', 'status'],
        },
        response: {
          201: {
            description: 'Device verification request created successfully',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              device_id: { type: 'string', format: 'uuid' },
              admin_id: { type: 'string', format: 'uuid' },
              status: { type: 'string', enum: ['PENDING', 'VERIFIED', 'REJECTED'] },
              created_at: { type: 'string', format: 'date-time' },
              note: { type: 'string' },
            },
            example: {
              id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
              device_id: 'f1e2d3c4-b5a6-9876-5432-10fedcba9876',
              admin_id: 'g1h2i3j4-k5l6-7890-1234-567890abcdef',
              status: 'PENDING',
              created_at: '2023-10-27T10:00:00.000Z',
              note: 'Initial verification request',
            },
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
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              device_id: { type: 'string', format: 'uuid' },
              admin_id: { type: 'string', format: 'uuid' },
              status: { type: 'string', enum: ['PENDING', 'VERIFIED', 'REJECTED'] },
              created_at: { type: 'string', format: 'date-time' },
              note: { type: 'string' },
            },
            example: {
              id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
              device_id: 'f1e2d3c4-b5a6-9876-5432-10fedcba9876',
              admin_id: 'g1h2i3j4-k5l6-7890-1234-567890abcdef',
              status: 'VERIFIED',
              created_at: '2023-10-27T10:00:00.000Z',
              note: 'Device verified by admin',
            },
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
