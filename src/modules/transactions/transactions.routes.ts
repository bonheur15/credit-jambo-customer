
import { FastifyInstance } from 'fastify';
import { createTransactionHandler, getTransactionsHandler } from './transactions.controller';
import { createInsertSchema } from 'drizzle-zod';
import { transactions } from './transactions.schema';

const insertTransactionSchema = createInsertSchema(transactions);

export async function transactionsRoutes(server: FastifyInstance) {
  server.post(
    '/:accountId/transactions',
    {
      schema: {
        summary: 'Create a new transaction',
        tags: ['Transactions'],
        body: insertTransactionSchema,
        response: {
          201: insertTransactionSchema,
        },
      },
    },
    createTransactionHandler
  );

  server.get(
    '/:accountId/transactions',
    {
      schema: {
        summary: 'Get all transactions for an account',
        tags: ['Transactions'],
        response: {
          200: {
            type: 'array',
            items: insertTransactionSchema,
          },
        },
      },
    },
    getTransactionsHandler
  );
}
