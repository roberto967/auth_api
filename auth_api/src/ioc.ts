/* eslint-disable @typescript-eslint/no-explicit-any */
import { IocContainer } from 'tsoa';
import { container } from 'tsyringe';

// Doc.: https://tsoa-community.github.io/docs/di.html

export const iocContainer: IocContainer = {
  get<T>(controller: { new (...args: any[]): T }): T {
    return container.resolve<T>(controller);
  },
};
