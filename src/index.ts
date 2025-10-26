
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const server = Fastify({
  logger: true,
});

server.register(swagger, {
  swagger: {
    info: {
      title: 'Credit Jambo Customer API',
      description: 'API for Credit Jambo Customer Backend',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    host: 'localhost:4000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  },
});

import { usersRoutes } from './modules/users/users.routes';

server.register(swaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next();
    },
    preHandler: function (request, reply, next) {
      next();
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
});

import { authPlugin } from './plugins/auth';

server.register(authPlugin);

import { devicesRoutes } from './modules/devices/devices.routes';

server.register(usersRoutes, { prefix: '/api/users' });
import { accountsRoutes } from './modules/accounts/accounts.routes';

server.register(devicesRoutes, { prefix: '/api/devices' });
import { transactionsRoutes } from './modules/transactions/transactions.routes';

server.register(accountsRoutes, { prefix: '/api/accounts' });
server.register(transactionsRoutes, { prefix: '/api/accounts' });

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
