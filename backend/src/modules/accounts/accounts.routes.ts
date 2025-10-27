import { type FastifyInstance } from "fastify";
import {
  createAccountHandler,
  getAccountsHandler,
  getAccountBalanceHandler,
} from "./accounts.controller";
import { createInsertSchema } from "drizzle-zod";
import { accounts } from "./accounts.schema";
import { z } from "zod";

const insertAccountSchema = createInsertSchema(accounts);

export async function accountsRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      schema: {
        summary: "Create a new account",
        description: "Creates a new account for a user.",
        tags: ["Accounts"],
        body: {
          type: "object",
          properties: {
            currency: { type: "string" },
          },
        },
        response: {
          201: {
            description: "Account created successfully",
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              user_id: { type: "string", format: "uuid" },
              currency: { type: "string" },
              created_at: { type: "string", format: "date-time" },
            },
            example: {
              id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              user_id: "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
              currency: "RWF",
              created_at: "2023-10-27T10:00:00.000Z",
            },
          },
          400: {
            description: "Bad request, validation error",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    createAccountHandler,
  );

  server.get(
    "/",
    {
      schema: {
        summary: "Get all accounts",
        description:
          "Retrieves a list of all accounts for the authenticated user.",
        tags: ["Accounts"],
        response: {
          200: {
            description: "A list of accounts",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                user_id: { type: "string", format: "uuid" },
                currency: { type: "string" },
                created_at: { type: "string", format: "date-time" },
              },
            },
            example: [
              {
                id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
                user_id: "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
                currency: "RWF",
                created_at: "2023-10-27T10:00:00.000Z",
              },
            ],
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    getAccountsHandler,
  );
  server.get(
    "/:accountId/balance",
    {
      schema: {
        summary: "Get account balance",
        description: "Retrieves the current balance for a specific account.",
        tags: ["Accounts"],
        params: {
          type: "object",
          properties: {
            accountId: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            description: "Account balance retrieved successfully",
            type: "object",
            properties: {
              account_id: { type: "string", format: "uuid" },
              balance: { type: "number" },
              currency: { type: "string" },
              last_snapshot_at: { type: "string", format: "date-time" },
            },
            example: {
              account_id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
              balance: 1000.0,
              currency: "RWF",
              last_snapshot_at: "2023-10-27T10:00:00.000Z",
            },
          },
          404: {
            description: "Account not found",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            description: "Internal server error",
            type: "object",
            properties: {
              error: { type: "string" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    getAccountBalanceHandler,
  );
}
