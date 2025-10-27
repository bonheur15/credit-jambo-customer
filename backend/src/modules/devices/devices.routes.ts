import { type FastifyInstance } from "fastify";
import { registerDeviceHandler } from "./devices.controller";
import { createInsertSchema } from "drizzle-zod";
import { devices } from "./devices.schema";

const insertDeviceSchema = createInsertSchema(devices);

export async function devicesRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        summary: "Register a new device",
        description:
          "Registers a new device for a user, typically a mobile phone or a computer.",
        tags: ["Devices"],
        body: {
          type: "object",
          properties: {
            device_id: { type: "string" },
            device_meta: { type: "object" },
            created_by: { type: "string" },
          },
          required: ["device_id"],
        },
        response: {
          201: {
            description: "Device registered successfully",
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              user_id: { type: "string", format: "uuid" },
              device_id: { type: "string" },
              device_meta: { type: "object" },
              registered_at: { type: "string", format: "date-time" },
              created_by: { type: "string" },
            },
            example: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              user_id: "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
              device_id: "some-unique-device-id",
              device_meta: { os: "Android", version: "12" },
              registered_at: "2025-10-27T10:00:00.000Z",
              created_by: "client",
            },
          },
          400: {
            description: "Bad request, validation error",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    registerDeviceHandler,
  );
}
