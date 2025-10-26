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

  try {
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
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

export async function getTransactionsHandler(
  request: FastifyRequest<{ Params: { accountId: string } }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;

  try {
    const transactions = await findTransactionsByAccountId(accountId);
    return reply.code(200).send(transactions);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}