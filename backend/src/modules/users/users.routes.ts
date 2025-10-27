import { type FastifyInstance } from "fastify";
import {
  registerUserHandler,
  loginHandler,
  refreshTokenHandler,
} from "./users.controller";
import { createInsertSchema } from "drizzle-zod";
import { users } from "./users.schema";
import { z } from "zod";
import { $ref } from "../../schemas";

const insertUserSchema = createInsertSchema(users);
const loginSchema = createInsertSchema(users, {
  email: z.string().email(),
  password_hash: z.string().min(8),
});

export async function usersRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password_hash: { type: "string", minLength: 8 },
            name: { type: "string" },
          },
          required: ["email", "password_hash"],
        },
        response: {
          201: {
            description: "User created successfully",
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              email: { type: "string", format: "email" },
              name: { type: "string" },
            },
            example: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              email: "user@example.com",
              name: "John Doe",
              created_at: "2023-10-27T10:00:00.000Z",
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
    registerUserHandler,
  );

  server.post(
    "/login",
    {
      schema: {
        summary: "Login a user",
        description: "Authenticates a user and returns a JWT token.",
        tags: ["Users"],
        body: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            password_hash: { type: "string", minLength: 8 },
          },
          required: ["email", "password_hash"],
        },
        response: {
          200: {
            description: "Login successful, JWT token returned",
            type: "object",
            properties: {
              jwt: { type: "string" },
              refresh_token: { type: "string" },
            },
            example: {
              jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
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
          401: {
            description: "Unauthorized, invalid credentials",
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
    loginHandler,
  );
  server.post(
    "/refresh-token",
    {
      schema: {
        summary: "Refresh JWT token",
        description: "Refreshes an expired JWT token using a refresh token.",
        tags: ["Users"],
        body: {
          type: "object",
          properties: {
            refresh_token: { type: "string" },
          },
          required: ["refresh_token"],
        },
        response: {
          200: {
            description: "Token refreshed successfully",
            type: "object",
            properties: {
              jwt: { type: "string" },
              refresh_token: { type: "string" },
            },
            example: {
              jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
              refresh_token: "another-long-refresh-token",
            },
          },
          401: {
            description: "Unauthorized, invalid refresh token",
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
    refreshTokenHandler,
  );
}
