import { Elysia } from 'elysia';
import { AppError } from '@/common/errors/app-error';

export const errorPlugin = new Elysia().onError(({ code, error, set }) => {
  if (error instanceof AppError) {
    set.status = error.statusCode;

    return {
      success: false,
      message: error.message,
      code: error.code,
    };
  }

  set.status = 500;

  return {
    success: false,
    message: 'Internal Server Error',
  };
});
