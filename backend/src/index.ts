
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

const server = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

import { usersRoutes } from './modules/users/users.routes';



import { authPlugin } from './plugins/auth';

import { auditPlugin } from './plugins/audit';

server.register(authPlugin);
server.register(auditPlugin);

import { devicesRoutes } from './modules/devices/devices.routes';

server.register(usersRoutes, { prefix: '/api/users' });
import { accountsRoutes } from './modules/accounts/accounts.routes';

server.register(devicesRoutes, { prefix: '/api/devices' });
import { transactionsRoutes } from './modules/transactions/transactions.routes';

server.register(accountsRoutes, { prefix: '/api/accounts' });
import { deviceVerificationsRoutes } from './modules/device_verifications/device_verifications.routes';

server.register(transactionsRoutes, { prefix: '/api/accounts' });
server.register(deviceVerificationsRoutes, { prefix: '/api/device-verifications' });

server.get('/', async (request, reply) => {
  return { hello: 'world' };
});

const start = async () => {
  try {
    await server.listen({ port: 4000, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
