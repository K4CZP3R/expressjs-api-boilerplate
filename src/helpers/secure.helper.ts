import * as crypto from "crypto";

export function generateNumberBetween(min: number, max: number): number {
  return crypto.randomInt(min, max);
}

export function generateRandomSecret(lengthEven: number): string {
  return crypto.randomBytes(lengthEven / 2).toString("hex");
}
