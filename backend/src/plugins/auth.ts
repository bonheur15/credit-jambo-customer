import {
  type FastifyRequest,
  type FastifyReply,
  type FastifyInstance,
} from "fastify";
import { jwtVerify } from "jose";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyRequest {
    user: {
      id: string;
      email: string;
    } | null;
  }
}

async function auth(server: FastifyInstance) {
  server.decorateRequest("user", null);
  server.addHook(
    "preHandler",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (
        request.url.startsWith("/api/users/login") ||
        request.url.startsWith("/api/users") ||
        request.url.startsWith("/api/device-verifications/") ||
        ((request.url === "/api/devices" || request.url === "/api/devices/") &&
          request.method === "POST") ||
        request.url.startsWith("/documentation")
      ) {
        return;
      }

      const { authorization } = request.headers;

      if (!authorization) {
        return reply.code(401).send({ message: "Unauthorized" });
      }

      const token = authorization.replace("Bearer ", "");

      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        request.user = payload as any;
      } catch (error) {
        return reply.code(401).send({ message: "Unauthorized" });
      }
    },
  );
}

export const authPlugin = fp(auth);
