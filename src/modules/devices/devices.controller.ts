
import { FastifyRequest, FastifyReply } from 'fastify';
import { createDevice, findDeviceByDeviceId } from './devices.service';
import { CreateDeviceInput } from './devices.service';

export async function registerDeviceHandler(
  request: FastifyRequest<{ Body: CreateDeviceInput }>,
  reply: FastifyReply
) {
  const body = request.body;

  try {
    const device = await findDeviceByDeviceId(body.device_id);

    if (device) {
      return reply.code(409).send({
        message: 'Device already exists',
      });
    }

    const createdDevice = await createDevice({
      ...body,
      user_id: request.user.id,
    });

    return reply.code(201).send(createdDevice);
  } catch (e) {
    console.error(e);
    return reply.code(500).send(e);
  }
}
