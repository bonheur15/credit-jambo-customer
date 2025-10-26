
import { FastifyInstance } from 'fastify';
import { createAccountHandler, getAccountsHandler } from './accounts.controller';
import { createInsertSchema } from 'drizzle-zod';
import { accounts } from './accounts.schema';
import { z } from 'zod';

const insertAccountSchema = createInsertSchema(accounts);

export async function accountsRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: "Create a new account",
        description: "Create a new account for a user",
        tags: ["Accounts"],
      },
      body: insertAccountSchema,
      response: {
        201: insertAccountSchema,
      },
    },
    createAccountHandler
  );

  server.get(
    '/',
    {
      schema: {
        summary: "Get all accounts for a user",
        description: "Get all accounts for the currently authenticated user",
        tags: ["Accounts"],
      },
      response: {
        200: z.array(insertAccountSchema),
      },
    },
    getAccountsHandler
  );
}
