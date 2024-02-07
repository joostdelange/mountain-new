import { object, optional, literal, string, regex, boolean, number, type Output } from 'valibot';
import { DateTime } from 'luxon';

export enum PageVersion {
  CONCEPT = 'concept',
  PUBLISHED = 'published',
};

export const PageSKRegex = /^site#[a-f\d-]+#page#(concept|published)#[a-f\d-]+$/;

export const PageSchema = object({
  PK: optional(literal('page'), 'page'),
  SK: optional(string([regex(PageSKRegex)]), ''),
  pageId: optional(string(), ''),
  link: optional(string(), ''),
  title: optional(string(), ''),
  metaDescription: optional(string()),
  language: optional(string(), 'nl-NL'),
  divertedFromPublished: optional(boolean()),
  updatedAt: optional(number(), DateTime.now().toSeconds()),
});

export type Page = Output<typeof PageSchema>;
