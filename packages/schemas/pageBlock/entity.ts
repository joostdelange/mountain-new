import { object, optional, literal, string, regex, number, type Output } from 'valibot';
import { BlockSchema } from '../block/entity';

export const PageBlockSKRegex = /^page#(concept|published)#[a-f\d-]+#pageBlock#[a-f\d-]+$/;

export const PageBlockSchema = object({
  PK: optional(literal('pageBlock'), 'pageBlock'),
  SK: optional(string([regex(PageBlockSKRegex)]), ''),
  pageBlockId: optional(string(), ''),
  blockId: string(),
  position: number(),
  block: optional(BlockSchema),
});

export type PageBlock = Output<typeof PageBlockSchema>;
