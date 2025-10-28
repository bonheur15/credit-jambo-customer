import { FastifyRequest, FastifyReply } from "fastify";
import { createDevice, findDeviceByDeviceId } from "./devices.service";
import { CreateDeviceInput } from "./devices.service";
import { createEvent } from "../events/events.service";
import { ConflictError, AppError } from "../../utils/errors";

export async function registerDeviceHandler(
  request: FastifyRequest<{ Body: CreateDeviceInput }>,
  reply: FastifyReply,
) {
  const body = request.body;

  const device = await findDeviceByDeviceId(body.device_id);

  if (device) {
    throw new ConflictError("Device already exists");
  }

  const createdDevice = await createDevice({
    ...body,
    user_id: body.user_id,
  });

  if (!createdDevice) {
    throw new AppError("Failed to create device", 500);
  }
  await createEvent({
    aggregate_type: "device",
    aggregate_id: createdDevice.id,
    event_type: "DeviceRegistered",
    payload: {
      device_id: createdDevice.device_id,
      user_id: createdDevice.user_id,
    },
  });

  return reply.code(201).send(createdDevice);
}
