import { object, optional, literal, string, uuid, array, enum_, record, any, number, type Output } from 'valibot';
import { DateTime } from 'luxon';

export enum BlockFieldType {
  TEXT = 'text',
  EDITOR = 'editor',
  NUMBER = 'number',
  BUTTON = 'button',
}

export const BlockSchema = object({
  PK: optional(literal('block'), 'block'),
  SK: optional(string([uuid()]), ''),
  siteId: optional(string([uuid()])),
  name: optional(string(), ''),
  label: optional(string(), ''),
  description: optional(string(), ''),
  fields: optional(array(object({
    name: optional(string(), ''),
    label: optional(string(), ''),
    type: enum_(BlockFieldType),
    options: optional(record(any())),
  })), []),
  updatedAt: optional(number(), DateTime.now().toSeconds()),
});

export type Block = Output<typeof BlockSchema>;
