
import { FastifyInstance } from 'fastify';
import { registerUserHandler } from './users.controller';
import { createInsertSchema } from 'drizzle-zod';
import { users } from './users.schema';

const insertUserSchema = createInsertSchema(users);

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
}
