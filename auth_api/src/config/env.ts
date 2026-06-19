import dotenv from 'dotenv';
import { TokenVariables } from './interfaces/token-config.interface';
import { DbEnvVariables } from './interfaces/db-config.interface';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env' });
} else if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config({ path: '.env.development' });
}

export const PORT = process.env.PORT;

export const tokenConfig: TokenVariables = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

export const dbEnvVariables: DbEnvVariables = {
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: parseInt(process.env.DATABASE_PORT),
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE: process.env.DATABASE,
};
