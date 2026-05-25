import { t } from 'elysia';
import { createUserDto } from './create-user.dto';

export const updateUserDto = t.Partial(createUserDto);

export type UpdateUserDto = typeof updateUserDto.static;
