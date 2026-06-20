import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';
import { dbEnvVariables } from './env';

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: dbEnvVariables.DB_HOST,
  port: dbEnvVariables.DB_PORT,
  username: dbEnvVariables.DB_USER,
  password: dbEnvVariables.DB_PASSWORD,
  database: dbEnvVariables.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'production',
  // dropSchema: true, // Adicione esta linha para dropar o schema a cada conexão
  logging: true,
  entities: [
    path.join(__dirname + '/../modules/**/entities/*.entity{.ts,.js}'),
  ],
  migrations: [path.join(__dirname, '/../database/migrations/*{.ts,.js}')],
  subscribers: [path.join(__dirname, '/../database/subscribers/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
};
