import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { dbConfig } from '../../config/dbConfig';
import { RoleSeed } from '../../modules/v1/auth/seed/role/role.seed';

const options: DataSourceOptions & SeederOptions = {
  ...dbConfig,
  seeds: [RoleSeed],
};

const dataSource = new DataSource(options);

dataSource
  .initialize()
  .then(async () => {
    console.log('Database connection established successfully!');
    await runSeeders(dataSource, options);
    console.log('Seeders executed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error(
      'Error connecting to the database or executing seeders',
      error,
    );
    process.exit(1);
  });
