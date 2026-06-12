import crypto from "crypto";

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(String(password), salt, 120000, 32, "sha256").toString("hex");
  return `pbkdf2$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [, salt, hash] = String(stored || "").split("$");
  if (!salt || !hash) return false;
  const candidate = hashPassword(password, salt).split("$")[2];
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
  } catch {
    return false;
  }
}
