import { db } from "../../db/db";
import { users, refreshTokens } from "./users.schema";
import { eq, and, isNull } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { createHash } from "crypto";
import { randomBytes } from "crypto";

const insertUserSchema = createInsertSchema(users);
const insertRefreshTokenSchema = createInsertSchema(refreshTokens);

export type CreateUserInput = z.infer<typeof insertUserSchema>;
export type CreateRefreshTokenInput = z.infer<typeof insertRefreshTokenSchema>;

export async function createUser(data: CreateUserInput) {
  const result = await db.insert(users).values(data).returning();
  return result[0];
}

export async function findUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

export async function findUserById(id: string) {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
}

export async function createRefreshToken(
  data: Omit<CreateRefreshTokenInput, "token_hash">,
) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const result = await db
    .insert(refreshTokens)
    .values({
      ...data,
      token_hash: tokenHash,
    })
    .returning();
  return { refreshToken: token, dbEntry: result[0] };
}

export async function findRefreshToken(token: string) {
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const result = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.token_hash, tokenHash),
        isNull(refreshTokens.revoked_at),
      ),
    );
  return result[0];
}

export async function revokeRefreshToken(id: string) {
  const result = await db
    .update(refreshTokens)
    .set({
      revoked_at: new Date(),
    })
    .where(eq(refreshTokens.id, id))
    .returning();
  return result[0];
}
