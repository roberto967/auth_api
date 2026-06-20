import { Seeder } from 'typeorm-extension';
import * as fs from 'fs';
import * as path from 'path';
import { RoleSeedData } from './types/role-seed-data.type';
import { DataSource } from 'typeorm';
import { Role } from '../../entities/roles.entity';

const SEED_DIR = __dirname;
const DATA_PATH = path.resolve(SEED_DIR, 'data.json');

export class RoleSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const rawData = fs.readFileSync(DATA_PATH, 'utf-8');

    const { roles: roleSeedData } = JSON.parse(rawData) as {
      roles: RoleSeedData[];
    };

    console.log('init seeding roles...');

    await dataSource.transaction(async manager => {
      const roleRepository = manager.getRepository(Role);

      for (const roleData of roleSeedData) {
        const existingRole = await roleRepository.findOne({
          where: { name: roleData.name },
        });

        if (existingRole) {
          console.log(`Role "${roleData.name}" already exists. Skipping...`);
          continue;
        }

        const roleEntity = roleRepository.create({
          name: roleData.name,
          description: roleData.description,
        });

        await roleRepository.save(roleEntity);
        console.log(`Role "${roleData.name}" created successfully.`);
      }
    });
  }
}
