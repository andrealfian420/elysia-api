import { Elysia } from 'elysia';
import { AppError } from '@/common/errors/app-error';
import { response } from '@/common/helpers/response.helper';

export const errorPlugin = new Elysia().onError(
  { as: 'global' },
  ({ code, error, set }) => {
    if (error instanceof AppError) {
      set.status = error.statusCode;

      return response({
        success: false,
        message: error.message,
      });
    }

    set.status = 500;

    return response({
      success: false,
      message: 'Internal Server Error',
    });
  },
);
