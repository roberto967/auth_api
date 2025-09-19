import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { HttpError } from '../../../../error/http.error';
import { HttpErrors } from '../../../../common/Enum/httpsErros.enum';

export function validateDto<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new HttpError(
        'ValidationError',
        HttpErrors.BadRequest,
        'Validation Failed',
        errors.flatMap(error => Object.values(error.constraints || {})),
      );
    }

    next();
  };
}
