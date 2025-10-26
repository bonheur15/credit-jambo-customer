import { FastifyInstance } from 'fastify';
import { registerUserHandler, loginHandler } from './users.controller';
import { createInsertSchema } from 'drizzle-zod';
import { users } from './users.schema';
import { z } from 'zod';

const insertUserSchema = createInsertSchema(users);
const loginSchema = createInsertSchema(users, {
  email: z.string().email(),
  password_hash: z.string().min(8),
});

export async function usersRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: "Create a new user",
        description: "Create a new user with email and password",
        tags: ["Users"],
      },
      body: insertUserSchema,
      response: {
        201: insertUserSchema,
      },
    },
    registerUserHandler
  );

  server.post(
    '/login',
    {
      schema: {
        summary: "Login a user",
        description: "Login a user with email and password",
        tags: ["Users"],
      },
      body: loginSchema,
      response: {
        200: z.object({
          jwt: z.string(),
        }),
      },
    },
    loginHandler
  );
}