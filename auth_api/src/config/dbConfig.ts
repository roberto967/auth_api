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
  synchronize: true, // never use TRUE in production!
  // dropSchema: true, // Adicione esta linha para dropar o schema a cada conexão
  logging: true,
  entities: [
    path.join(__dirname + '/../modules/**/entities/*.entity{.ts,.js}'),
  ],
  migrations: [path.join(__dirname, '/../database/migrations/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
};
