import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';

export const dbConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // never use TRUE in production!
  // dropSchema: true, // Adicione esta linha para dropar o schema a cada conexão
  logging: true,
  entities: [
    path.join(__dirname + '/../modules/**/entities/*.entity{.ts,.js}'),
  ],
  migrations: [path.join(__dirname, '/../database/migrations/*{.ts,.js}')],
  namingStrategy: new SnakeNamingStrategy(),
};
