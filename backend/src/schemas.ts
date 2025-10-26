
import { buildJsonSchemas } from "./utils/buildJsonSchemas";
import { createInsertSchema } from "drizzle-zod";
import { accounts } from "./modules/accounts/accounts.schema";
import { deviceVerifications } from "./modules/device_verifications/device_verifications.schema";
import { devices } from "./modules/devices/devices.schema";
import { transactions } from "./modules/transactions/transactions.schema";
import { users } from "./modules/users/users.schema";

const insertAccountSchema = createInsertSchema(accounts);
const insertDeviceVerificationSchema = createInsertSchema(deviceVerifications);
const insertDeviceSchema = createInsertSchema(devices);
const insertTransactionSchema = createInsertSchema(transactions);
const insertUserSchema = createInsertSchema(users);

export const { schemas, $ref } = buildJsonSchemas({
  accounts: insertAccountSchema,
  deviceVerifications: insertDeviceVerificationSchema,
  devices: insertDeviceSchema,
  transactions: insertTransactionSchema,
  users: insertUserSchema,
});
