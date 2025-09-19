import { IsArray, IsNumber, IsString } from 'class-validator';
import { IErrorResponse } from './interface/error.interface';

export class HttpError extends Error implements IErrorResponse {
  @IsString()
  public readonly name: string;

  @IsNumber()
  public readonly statusCode: number;

  @IsArray()
  @IsString({ each: true })
  public readonly details: string[];

  constructor(
    name: string,
    statusCode: number,
    message: string,
    details: string[] = [],
  ) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toJSON() {
    return {
      name: this.name,
      statusCode: this.statusCode,
      message: this.message,
      details: this.details,
    };
  }
}
