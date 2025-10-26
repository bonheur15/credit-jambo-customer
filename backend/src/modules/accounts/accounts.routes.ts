
import { FastifyInstance } from 'fastify';
import { createAccountHandler, getAccountsHandler } from './accounts.controller';
import { createInsertSchema } from 'drizzle-zod';
import { accounts } from './accounts.schema';
import { z } from 'zod';
import { $ref } from '../../schemas';

const insertAccountSchema = createInsertSchema(accounts);

export async function accountsRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      schema: {
        summary: 'Create a new account',
        description: 'Creates a new account for a user.',
        tags: ['Accounts'],
        body: { type: 'object', properties: { account: $ref('accounts') } },
        response: {
          201: {
            description: 'Account created successfully',
            ...$ref('accounts'),
          },
          400: {
            description: 'Bad request, validation error',
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
    createAccountHandler
  );

  server.get(
    '/',
    {
      schema: {
        summary: 'Get all accounts',
        description: 'Retrieves a list of all accounts for the authenticated user.',
        tags: ['Accounts'],
        response: {
          200: {
            description: 'A list of accounts',
            type: 'array',
            items: $ref('accounts'),
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
    getAccountsHandler
  );
}
