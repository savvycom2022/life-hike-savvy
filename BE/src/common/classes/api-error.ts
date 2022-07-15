import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiError extends HttpException {
  public data: any;
  public message: string;

  constructor(message: string, data?: any) {
    super(message, HttpStatus.BAD_REQUEST);

    this.data = data;
    this.message = message;
  }

  static error(message: string, data?: any) {
    throw new ApiError(message, data);
  }
}
