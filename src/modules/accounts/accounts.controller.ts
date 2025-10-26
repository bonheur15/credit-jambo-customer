
import { FastifyRequest, FastifyReply } from 'fastify';
import { createAccount, findAccountsByUserId } from './accounts.service';
import { CreateAccountInput } from './accounts.service';

export async function createAccountHandler(
  request: FastifyRequest<{ Body: CreateAccountInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const createdAccount = await createAccount({
      ...body,
      user_id: request.user.id,
    });

    return reply.code(201).send(createdAccount);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

export async function getAccountsHandler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const accounts = await findAccountsByUserId(request.user.id);
    return reply.code(200).send(accounts);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}
