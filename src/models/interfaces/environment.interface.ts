import { z } from "zod";

/**
 * Valid environmental vars from .env
 */
export interface IRawEnvironment {
  ENVIRONMENT: string;
  SERVER_PORT: string;
  DATABASE_URL: string;
  JWKS_ENDPOINT: string;
  JWK_AUDIENCE: string;
  JWK_SCOPES: string;
}

export const environmentSchema = z.object({
  ENVIRONMENT: z.enum(["dev", "prod"]),
  SERVER_PORT: z.string().transform(v => parseInt(v, 10)),
  DATABASE_URL: z.string(),
  JWKS_ENDPOINT: z.string(),
  JWK_AUDIENCE: z.string(),
  // Jwk scope is a string of comma separated values
  JWK_SCOPES: z.string().transform(v => v.split(" ")),
});

export type IEnvironment = z.infer<typeof environmentSchema>;

/**
 * Needed to be able to strip environment from unused properties
 * (this is something like allow-list)
 *
 * There is no other way to get keys of an interface in TypeScript
 * @link https://stackoverflow.com/a/54308812
 */
type KeysEnum<T> = { [P in keyof Required<T>]: true };
export const IEnvironmentKeys: KeysEnum<IEnvironment> = {
  ENVIRONMENT: true,
  SERVER_PORT: true,
  DATABASE_URL: true,
  JWKS_ENDPOINT: true,
  JWK_AUDIENCE: true,
  JWK_SCOPES: true,
};
