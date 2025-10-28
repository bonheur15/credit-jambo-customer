import Fastify from "fastify";
import cors from "@fastify/cors";

import { schemas } from "./schemas";

const server = Fastify({
  logger: true,
});

server.register(cors, {
  origin: ["http://localhost:3000", "http://localhost:3001"],
});

import { usersRoutes } from "./modules/users/users.routes";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

server.register(swagger, {
  openapi: {
    info: {
      title: "Credit Jambo Customer API",
      description: "API for Credit Jambo Customer Backend",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description:
        "https://pricey-thumb-392.notion.site/backend-full-documentation-2989e6b42499805792a1ecc93c463609",
    },
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  transform({ schema, url }) {
    return {
      schema: schema,
      url: url,
    };
  },
});

server.register(swaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "full",
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

import { authPlugin } from "./plugins/auth";

import { auditPlugin } from "./plugins/audit";

server.register(authPlugin);
server.register(auditPlugin);

import errorHandler from "./plugins/errorHandler";
server.register(errorHandler);

import rateLimit from "@fastify/rate-limit";
server.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});

import { devicesRoutes } from "./modules/devices/devices.routes";

server.register(usersRoutes, { prefix: "/api/users" });
import { accountsRoutes } from "./modules/accounts/accounts.routes";

server.register(devicesRoutes, { prefix: "/api/devices" });
import { transactionsRoutes } from "./modules/transactions/transactions.routes";

server.register(accountsRoutes, { prefix: "/api/accounts" });
import { deviceVerificationsRoutes } from "./modules/device_verifications/device_verifications.routes";

server.register(transactionsRoutes, { prefix: "/api/accounts" });
server.register(deviceVerificationsRoutes, {
  prefix: "/api/device-verifications",
});

server.get("/", async (request, reply) => {
  return { hello: "world" };
});

const start = async () => {
  try {
    await server.listen({ port: 4000, host: "0.0.0.0" });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
