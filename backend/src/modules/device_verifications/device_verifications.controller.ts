
import { FastifyRequest, FastifyReply } from 'fastify';
import { createDeviceVerification, findDeviceVerificationByDeviceId } from './device_verifications.service';
import { CreateDeviceVerificationInput } from './device_verifications.service';

export async function createDeviceVerificationHandler(
  request: FastifyRequest<{ Body: CreateDeviceVerificationInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const createdDeviceVerification = await createDeviceVerification({
      ...body,
      admin_id: request.user.id,
    });

    return reply.code(201).send(createdDeviceVerification);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}

export async function getDeviceVerificationHandler(
  request: FastifyRequest<{ Params: { deviceId: string } }>,
  reply: FastifyReply
) {
  const { deviceId } = request.params;

  try {
    const deviceVerification = await findDeviceVerificationByDeviceId(deviceId);
    return reply.code(200).send(deviceVerification);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}
