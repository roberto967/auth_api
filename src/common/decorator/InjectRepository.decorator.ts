// src/common/decorators/InjectRepository.ts

import { container, InjectionToken, inject } from 'tsyringe';
import { EntitySchema, ObjectType } from 'typeorm';
import { appDataSource } from '../../database/dbConnection';

type Entity<T> = ObjectType<T> | EntitySchema<T>;

function getEntityName<T>(entity: Entity<T>): string {
  if (entity instanceof EntitySchema) {
    return entity.options.name;
  }
  return entity.name;
}

export function InjectRepository<T>(entity: Entity<T>): ParameterDecorator {
  const entityName = getEntityName(entity);
  const repositoryToken: InjectionToken = `${entityName}Repository`;

  try {
    container.resolve(repositoryToken);
  } catch {
    container.register(repositoryToken, {
      useFactory: () => appDataSource.getRepository(entity),
    });
  }

  return inject(repositoryToken);
}
