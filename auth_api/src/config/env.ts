import dotenv from 'dotenv';
import {
  TokenDurationVariables,
  TokenVariables,
} from './interfaces/token-config.interface';
import { DbEnvVariables } from './interfaces/db-config.interface';

const envPaths: Partial<Record<string, string>> = {
  production: '.env',
  test: '.env.test',
};

dotenv.config({
  path: envPaths[process.env.NODE_ENV ?? ''] ?? '.env.development',
});

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const PORT = process.env.PORT;

export const tokenConfig: TokenVariables = {
  ACCESS_TOKEN_SECRET: requireEnv('ACCESS_TOKEN_SECRET'),
};

export const tokenDurationConfig: TokenDurationVariables = {
  REFRESH_TOKEN_DURATION_MS: parseInt(requireEnv('REFRESH_TOKEN_DURATION_MS')),
  ACCESS_TOKEN_DURATION_MS: parseInt(requireEnv('ACCESS_TOKEN_DURATION_MS')),
  CONFIRMATION_TOKEN_DURATION_MS: parseInt(
    requireEnv('CONFIRMATION_TOKEN_DURATION_MS'),
  ),
};

export const dbEnvVariables: DbEnvVariables = {
  DB_HOST: requireEnv('DB_HOST'),
  DB_PORT: parseInt(requireEnv('DB_PORT')),
  DB_USER: requireEnv('DB_USER'),
  DB_PASSWORD: requireEnv('DB_PASSWORD'),
  DB_NAME: requireEnv('DB_NAME'),
};
