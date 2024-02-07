import { object, literal, string, uuid, email, enum_, optional, array, type Output } from 'valibot';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
};

export const UserSchema = object({
  PK: literal('user'),
  SK: string([uuid()]),
  email: string([email()]),
  firstName: string(),
  lastName: string(),
  role: optional(enum_(UserRole)),
  siteIds: array(string([uuid()])),
});

export type User = Output<typeof UserSchema>;
