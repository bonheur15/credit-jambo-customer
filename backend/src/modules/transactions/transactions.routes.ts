
import type { FastifyInstance } from 'fastify';
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
        body: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL'] },
            amount: { type: 'number' },
            reference: { type: 'string' },
            meta: { type: 'object' },
          },
          required: ['type', 'amount'],
        },
        response: {
          201: {
            description: 'Transaction created successfully',
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              account_id: { type: 'string', format: 'uuid' },
              type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL'] },
              amount: { type: 'number' },
              reference: { type: 'string' },
              meta: { type: 'object' },
              created_at: { type: 'string', format: 'date-time' },
              created_by: { type: 'string', format: 'uuid' },
              status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED'] },
            },
            example: {
              id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
              account_id: 'f1e2d3c4-b5a6-9876-5432-10fedcba9876',
              type: 'DEPOSIT',
              amount: 100.00,
              reference: 'salary-oct-2023',
              meta: { bank: 'ExampleBank' },
              created_at: '2023-10-27T10:00:00.000Z',
              created_by: 'g1h2i3j4-k5l6-7890-1234-567890abcdef',
              status: 'COMPLETED',
            },
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
        querystring: {
          type: 'object',
          properties: {
            all: {
              type: 'string',
              description: 'If set to "true", returns all transactions. Otherwise, returns the last 2 transactions.',
            },
          },
        },
        response: {
          200: {
            description: 'A list of transactions',
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                account_id: { type: 'string', format: 'uuid' },
                type: { type: 'string', enum: ['DEPOSIT', 'WITHDRAWAL'] },
                amount: { type: 'number' },
                reference: { type: 'string' },
                meta: { type: 'object' },
                created_at: { type: 'string', format: 'date-time' },
                created_by: { type: 'string', format: 'uuid' },
                status: { type: 'string', enum: ['PENDING', 'COMPLETED', 'FAILED'] },
              },
            },
            example: [
              {
                id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
                account_id: 'f1e2d3c4-b5a6-9876-5432-10fedcba9876',
                type: 'DEPOSIT',
                amount: 100.00,
                reference: 'salary-oct-2023',
                meta: { bank: 'ExampleBank' },
                created_at: '2023-10-27T10:00:00.000Z',
                created_by: 'g1h2i3j4-k5l6-7890-1234-567890abcdef',
                status: 'COMPLETED',
              },
              {
                id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
                account_id: 'f1e2d3c4-b5a6-9876-5432-10fedcba9876',
                type: 'WITHDRAWAL',
                amount: 50.00,
                reference: 'rent-payment',
                meta: { recipient: 'Landlord' },
                created_at: '2023-10-28T11:00:00.000Z',
                created_by: 'g1h2i3j4-k5l6-7890-1234-567890abcdef',
                status: 'COMPLETED',
              },
            ],
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
