import { IsArray, IsNumber, IsString } from 'class-validator';

export class HttpError extends Error {
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
}
