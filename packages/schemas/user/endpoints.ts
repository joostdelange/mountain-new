import { array, string, omit, type Output } from 'valibot';
import { UserSchema } from './entity';
import type { ErrorResponse } from '../error';

export const GetUsersOutput = array(UserSchema);

export const GetUserInput = string();
export const GetUserOutput = UserSchema;

export const UpdateUserInput = omit(UserSchema, ['role']);
export const UpdateUserOutput = GetUserOutput;

export type GetUsersOutput = Output<typeof GetUsersOutput>;
export type GetUsersError = ErrorResponse;

export type GetUserInput = Output<typeof GetUserInput>;
export type GetUserOutput = Output<typeof GetUserOutput>;
export type GetUserError = ErrorResponse;

export type UpdateUserInput = Output<typeof UpdateUserInput>;
export type UpdateUserOutput = Output<typeof UpdateUserOutput>;
export type UpdateUserError = ErrorResponse;
