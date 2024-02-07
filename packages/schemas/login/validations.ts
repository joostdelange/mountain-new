import { object, string, email, maxLength, minLength, type Output } from 'valibot';

export const LoginRequestValidationSchema = object({
  email: string([email()]),
});

export const LoginCompleteValidationSchema = object({
  code: string([minLength(6), maxLength(6)]),
});

export type LoginRequestValidationSchema = Output<typeof LoginRequestValidationSchema>;
export type LoginCompleteValidationSchema = Output<typeof LoginCompleteValidationSchema>;