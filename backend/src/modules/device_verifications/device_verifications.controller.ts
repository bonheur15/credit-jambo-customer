import type { FastifyRequest, FastifyReply } from 'fastify';
import { createDeviceVerification, findDeviceVerificationByDeviceId } from './device_verifications.service';
import type { CreateDeviceVerificationInput } from './device_verifications.service';
import { AppError, ForbiddenError } from '../../utils/errors';

export async function createDeviceVerificationHandler(
  request: FastifyRequest<{ Body: CreateDeviceVerificationInput }>,
  reply: FastifyReply
) {
  if (!request.user) {
    throw new AppError("Unauthorized", 401);
  }

  const createdDeviceVerification = await createDeviceVerification({
    ...request.body,
    admin_id: request.user.id,
  });

  return reply.code(201).send(createdDeviceVerification);
}

export async function getDeviceVerificationHandler(
  request: FastifyRequest<{ Params: { deviceId: string } }>,
  reply: FastifyReply
) {
  const { deviceId } = request.params;

  const deviceVerification = await findDeviceVerificationByDeviceId(deviceId);
  return reply.code(200).send(deviceVerification);
}
