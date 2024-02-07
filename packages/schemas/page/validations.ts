import { object, string, optional, minLength, type Output } from 'valibot';

export const PageUpdateValidationSchema = object({
  title: string([minLength(1, 'Title field is required')]),
  link: string(),
  metaDescription: optional(string()),
});

export type PageUpdateValidationSchema = Output<typeof PageUpdateValidationSchema>;
