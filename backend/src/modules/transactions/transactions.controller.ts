import { FastifyRequest, FastifyReply } from 'fastify';
import { createTransaction, findTransactionsByAccountId } from './transactions.service';
import { CreateTransactionInput } from './transactions.service';
import { createEvent } from '../events/events.service';

export async function createTransactionHandler(
  request: FastifyRequest<{ Body: CreateTransactionInput; Params: { accountId: string } }>,
  reply: FastifyReply
) {
  const body = request.body;
  const { accountId } = request.params;

  const createdTransaction = await createTransaction({
    ...body,
    account_id: accountId,
    created_by: request.user.id,
  });

  await createEvent({
    aggregate_type: 'transaction',
    aggregate_id: createdTransaction.id,
    event_type: createdTransaction.type === 'DEPOSIT' ? 'DepositCreated' : 'WithdrawalCreated',
    payload: {
      account_id: createdTransaction.account_id,
      amount: createdTransaction.amount,
    },
  });

  return reply.code(201).send(createdTransaction);
}

export async function getTransactionsHandler(
  request: FastifyRequest<{ Params: { accountId: string }; Querystring: { all?: string } }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;
  const { all } = request.query;

  const limit = all === 'true' ? undefined : 2;

  const transactions = await findTransactionsByAccountId(accountId, limit);
  return reply.code(200).send(transactions);
}