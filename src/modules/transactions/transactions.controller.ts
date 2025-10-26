
import { FastifyRequest, FastifyReply } from 'fastify';
import { createTransaction, findTransactionsByAccountId } from './transactions.service';
import { CreateTransactionInput } from './transactions.service';

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
