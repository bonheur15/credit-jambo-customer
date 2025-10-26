import { FastifyInstance } from 'fastify';
import { registerUserHandler, loginHandler } from './users.controller';
import { createInsertSchema } from 'drizzle-zod';
import { users } from './users.schema';

const insertUserSchema = createInsertSchema(users);
const loginSchema = createInsertSchema(users, {
  email: (schema) => schema.email.email(),
  password_hash: (schema) => schema.password_hash.min(8),
});

export async function usersRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: 'Create a new user',
        tags: ['Users'],
        body: insertUserSchema,
        response: {
          201: insertUserSchema,
        },
      },
    },
    registerUserHandler
  );

  server.post(
    '/login',
    {
      schema: {
        summary: 'Login a user',
        tags: ['Users'],
        body: loginSchema,
        response: {
          200: {
            type: 'object',
            properties: {
              jwt: { type: 'string' },
            },
          },
        },
      },
    },
    loginHandler
  );
}