import { object, literal, string, uuid, url, type Output } from 'valibot';

export const SiteSchema = object({
  PK: literal('site'),
  SK: string([uuid()]),
  name: string(),
  url: string([url()]),
});

export type Site = Output<typeof SiteSchema>;
