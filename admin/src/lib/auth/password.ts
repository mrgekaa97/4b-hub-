import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Minimal password strength check for the admin's own login. Deliberately
 * simple for a single-admin V1 tool — length is the strongest practical
 * signal without adding a full policy engine.
 */
export function isPasswordStrongEnough(plain: string): boolean {
  return plain.length >= 10;
}
