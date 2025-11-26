import { HttpStatus } from '@nestjs/common';

export interface HttpExceptionResponse {
  statusCode: number;
  message: string[];
  error: string;
}

export const buildHttpExceptionResponse = (
  status: HttpStatus,
  message: string[],
  error?: string,
): HttpExceptionResponse => ({
  statusCode: status,
  message,
  error: error ?? (HttpStatus[status] as string),
});
