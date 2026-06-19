import { dbConfig } from '../config/dbConfig';
import { DataSource } from 'typeorm';

export const appDataSource = new DataSource(dbConfig);

/* appDataSource
  .initialize()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  })
  .catch(error => {
    console.error('Erro ao conectar com o banco de dados', error);
  }); */
