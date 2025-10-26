
import { FastifyInstance } from 'fastify';
import { createTransactionHandler, getTransactionsHandler } from './transactions.controller';
import { createInsertSchema } from 'drizzle-zod';
import { transactions } from './transactions.schema';
import { z } from 'zod';

const insertTransactionSchema = createInsertSchema(transactions);

export async function transactionsRoutes(server: FastifyInstance) {
  server.post(
    '/:accountId/transactions',
    {
      schema: {
        summary: "Create a new transaction",
        description: "Create a new transaction for an account",
        tags: ["Transactions"],
        params: z.object({
          accountId: z.string().uuid(),
        }),
      },
      body: insertTransactionSchema,
      response: {
        201: insertTransactionSchema,
      },
    },
    createTransactionHandler
  );

  server.get(
    '/:accountId/transactions',
    {
      schema: {
        summary: "Get all transactions for an account",
        description: "Get all transactions for a specific account",
        tags: ["Transactions"],
        params: z.object({
          accountId: z.string().uuid(),
        }),
      },
      response: {
        200: z.array(insertTransactionSchema),
      },
    },
    getTransactionsHandler
  );
}
