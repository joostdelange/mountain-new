import { object, string, type Output } from 'valibot';

export const ErrorResponseSchema = object({
  message: string(),
});

export type ErrorResponse = Output<typeof ErrorResponseSchema>;
