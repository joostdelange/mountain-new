import { object, literal, string, uuid, length, enum_, number, type Output } from 'valibot';

export enum LoginStatus {
  REQUESTED = 'requested',
  COMPLETED = 'completed',
}

export const LoginSchema = object({
  PK: literal('login'),
  SK: string([uuid()]),
  userId: string([uuid()]),
  code: string([length(6)]),
  status: enum_(LoginStatus),
  createdAt: number(),
});

export type Login = Output<typeof LoginSchema>;
