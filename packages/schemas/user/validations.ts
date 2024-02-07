import { object, string, email, type Output } from 'valibot';

export const UserUpdateValidationSchema = object({
  email: string([email()]),
  firstName: string(),
  lastName: string(),
});

export type UserUpdateValidationSchema = Output<typeof UserUpdateValidationSchema>;