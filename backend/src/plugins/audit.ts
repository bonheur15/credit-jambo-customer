
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { createAuditLog } from '../modules/audit_logs/audit_logs.service';

async function audit(server: FastifyInstance) {
  server.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const { statusCode } = reply;
    const { method, url, user } = request;

    await createAuditLog({
      user_id: user?.id,
      action: `${method} ${url}`,
      meta: {
        statusCode,
      },
    });
  });
}

export const auditPlugin = fp(audit);
