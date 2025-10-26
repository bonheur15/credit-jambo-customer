import { type FastifyRequest, type FastifyReply } from "fastify";
import { createUser, findUserByEmail } from "./users.service";
import { type CreateUserInput } from "./users.service";
import { hash, verify } from "../../utils/hash";
import { SignJWT } from "jose";
import { createEvent } from "../events/events.service";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) {
  const body = request.body;
  try {
    const user = await findUserByEmail(body.email);

    if (user) {
      return reply.code(409).send({
        message: "User already exists",
      });
    }

    const { salt, hash: passwordHash } = await hash(body.password_hash);

    const createdUser = await createUser({
      ...body,
      password_hash: passwordHash,
      salt,
    });

    await createEvent({
      aggregate_type: "user",
      aggregate_id: createdUser?.id,
      event_type: "UserRegistered",
      payload: {
        email: createdUser?.email,
        name: createdUser?.name,
      },
    });

    return reply.code(201).send(createdUser);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const user = await findUserByEmail(body.email);

    if (!user) {
      return reply.code(401).send({
        message: "Invalid email or password",
      });
    }

    const isMatch = await verify(
      body.password_hash,
      user.salt,
      user.password_hash,
    );

    if (!isMatch) {
      return reply.code(401).send({
        message: "Invalid email or password",
      });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const alg = "HS256";

    const jwt = await new SignJWT({ id: user.id, email: user.email })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer("urn:example:issuer")
      .setAudience("urn:example:audience")
      .setExpirationTime("2h")
      .sign(secret);

    return reply.code(200).send({ jwt });
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}
