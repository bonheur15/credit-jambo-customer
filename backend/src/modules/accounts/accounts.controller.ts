import { FastifyRequest, FastifyReply } from 'fastify';
import { createAccount, findAccountsByUserId, getAccountBalance } from './accounts.service';
import { CreateAccountInput } from './accounts.service';
import { NotFoundError } from '../../utils/errors';

export async function createAccountHandler(
  request: FastifyRequest<{ Body: CreateAccountInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  const createdAccount = await createAccount({
    ...body,
    user_id: request.user.id,
  });

  return reply.code(201).send(createdAccount);
}

export async function getAccountsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const accounts = await findAccountsByUserId(request.user.id);
  return reply.code(200).send(accounts);
}

export async function getAccountBalanceHandler(
  request: FastifyRequest<{ Params: { accountId: string } }>,
  reply: FastifyReply
) {
  const { accountId } = request.params;

  const balance = await getAccountBalance(accountId);

  if (!balance) {
    throw new NotFoundError("Account not found or balance could not be retrieved");
  }

  return reply.code(200).send(balance);
}
