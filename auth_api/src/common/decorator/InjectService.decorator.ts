import { container, InjectionToken, inject } from 'tsyringe';
import { constructor } from 'tsyringe/dist/typings/types';

export function InjectService<T>(
  service: InjectionToken<T>,
): ParameterDecorator {
  try {
    container.resolve(service);
  } catch {
    container.registerSingleton(
      service as constructor<T>,
      service as constructor<T>,
    );
  }

  return inject(service);
}
