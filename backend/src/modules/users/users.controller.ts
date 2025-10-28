import { type FastifyRequest, type FastifyReply } from "fastify";
import {
  createUser,
  findUserByEmail,
  findUserById,
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
} from "./users.service";
import { type CreateUserInput } from "./users.service";
import { hash, verify } from "../../utils/hash";
import { SignJWT, jwtVerify } from "jose";
import { createEvent } from "../events/events.service";
import { findDeviceVerificationByDeviceId } from "../device_verifications/device_verifications.service";
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "../../utils/errors";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) {
  const body = request.body;
  const user = await findUserByEmail(body.email);

  if (user) {
    throw new ConflictError("User already exists");
  }

  const { salt, hash: passwordHash } = await hash(body.password_hash);

  const createdUser = await createUser({
    ...body,
    password_hash: passwordHash,
    role: "clients",
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
}

export async function loginHandler(
  request: FastifyRequest<{ Body: CreateUserInput & { device_id: string } }>,
  reply: FastifyReply,
) {
  const { email, password_hash, device_id } = request.body;

  const user = await findUserByEmail(email);

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const isMatch = await verify(password_hash, user.salt, user.password_hash);

  if (!isMatch) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const deviceVerification = await findDeviceVerificationByDeviceId(device_id);

  if (!deviceVerification || deviceVerification.status !== "VERIFIED") {
    throw new ForbiddenError("Device not verified or not registered");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  const alg = "HS256";

  const jwt = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    device_id,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("1m") // Short-lived access token
    .sign(secret);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Refresh token valid for 7 days

  const { refreshToken } = await createRefreshToken({
    user_id: user.id,
    device_id,
    expires_at: expiresAt,
  });

  return reply.code(200).send({ jwt, refresh_token: refreshToken });
}

export async function refreshTokenHandler(
  request: FastifyRequest<{ Body: { refresh_token: string } }>,
  reply: FastifyReply,
) {
  const { refresh_token } = request.body;

  const storedRefreshToken = await findRefreshToken(refresh_token);
  if (!storedRefreshToken || storedRefreshToken.expires_at < new Date()) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  // Revoke the old refresh token (append-only)
  await revokeRefreshToken(storedRefreshToken.id);

  const user = await findUserById(storedRefreshToken.user_id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const alg = "HS256";

  const newJwt = await new SignJWT({
    id: user.id,
    email: user.email,
    role: user.role,
    device_id: storedRefreshToken.device_id,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("15m") // Short-lived access token
    .sign(secret);

  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7); // New refresh token valid for 7 days

  const { refreshToken: newRefreshToken } = await createRefreshToken({
    user_id: user.id,
    device_id: storedRefreshToken.device_id,
    expires_at: newExpiresAt,
  });

  return reply.code(200).send({ jwt: newJwt, refresh_token: newRefreshToken });
}
