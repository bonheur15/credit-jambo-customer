
import { FastifyInstance } from 'fastify';
import { createAccountHandler, getAccountsHandler } from './accounts.controller';
import { createInsertSchema } from 'drizzle-zod';
import { accounts } from './accounts.schema';

const insertAccountSchema = createInsertSchema(accounts);

export async function accountsRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: 'Create a new account',
        tags: ['Accounts'],
        body: insertAccountSchema,
        response: {
          201: insertAccountSchema,
        },
      },
    },
    createAccountHandler
  );

  server.get(
    '/',
    {
      schema: {
        summary: 'Get all accounts for a user',
        tags: ['Accounts'],
        response: {
          200: {
            type: 'array',
            items: insertAccountSchema,
          },
        },
      },
    },
    getAccountsHandler
  );
}
