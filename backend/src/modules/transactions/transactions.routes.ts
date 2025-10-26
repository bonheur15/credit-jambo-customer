
import { FastifyInstance } from 'fastify';
import { createTransactionHandler, getTransactionsHandler } from './transactions.controller';
import { createInsertSchema } from 'drizzle-zod';
import { transactions } from './transactions.schema';
import { z } from 'zod';
import { $ref } from '../../schemas';

const insertTransactionSchema = createInsertSchema(transactions);

export async function transactionsRoutes(server: FastifyInstance) {
  server.post(
    '/:accountId/transactions',
    {
      schema: {
        summary: 'Create a new transaction',
        description: 'Creates a new transaction (deposit or withdrawal) for a given account.',
        tags: ['Transactions'],
        params: {
          type: 'object',
          properties: {
            accountId: {
              type: 'string',
              description: 'The ID of the account to create a transaction for.',
            },
          },
        },
        body: { type: 'object', properties: { transaction: $ref('transactions') } },
        response: {
          201: {
            description: 'Transaction created successfully',
            ...$ref('transactions'),
          },
          400: {
            description: 'Bad request, validation error',
            type: 'object',
            properties: {
              error: { type: 'string' },
              message: { type: 'string' },
            },
          },
          404: {
            description: 'Account not found',
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
    createTransactionHandler
  );

  server.get(
    '/:accountId/transactions',
    {
      schema: {
        summary: 'Get all transactions for an account',
        description: 'Retrieves a list of all transactions for a specific account.',
        tags: ['Transactions'],
        params: {
          type: 'object',
          properties: {
            accountId: {
              type: 'string',
              description: 'The ID of the account to retrieve transactions for.',
            },
          },
        },
        response: {
          200: {
            description: 'A list of transactions',
            type: 'array',
            items: $ref('transactions'),
          },
          404: {
            description: 'Account not found',
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
    getTransactionsHandler
  );
}
