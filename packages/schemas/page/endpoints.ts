import { array, string, omit, object, optional, type Output } from 'valibot';
import { PageSchema } from './entity';
import { PageBlockSchema } from '../pageBlock';
import { ErrorResponseSchema, ErrorResponse } from '../error';

export const GetPagesOutput = array(PageSchema);

export const GetPageInput = string();
export const GetPageOutput = omit(
  object({
    ...PageSchema.entries,
    blocks: optional(array(omit(object({
      ...PageBlockSchema.entries,
      SK: optional(string()),
      pageBlockId: optional(string()),
    }), ['PK'])), []),
  }),
  ['PK', 'SK', 'updatedAt'],
);

export const CreatePageInput = omit(PageSchema, ['PK', 'SK', 'updatedAt']);
export const CreatePageOutput = GetPageOutput;

export const UpdatePageInput = GetPageOutput;
export const UpdatePageOutput = GetPageOutput;

export const DeletePageInput = string();
export const DeletePageOutput = ErrorResponseSchema;

export type GetPagesOutput = Output<typeof GetPagesOutput>;
export type GetPagesError = ErrorResponse;

export type GetPageInput = Output<typeof GetPageInput>;
export type GetPageOutput = Output<typeof GetPageOutput>;
export type GetPageError = ErrorResponse;

export type CreatePageInput = Output<typeof CreatePageInput>;
export type CreatePageOutput = Output<typeof CreatePageOutput>;
export type CreatePageError = ErrorResponse;

export type UpdatePageInput = Output<typeof UpdatePageInput>;
export type UpdatePageOutput = Output<typeof UpdatePageOutput>;
export type UpdatePageError = ErrorResponse;

export type DeletePageInput = Output<typeof DeletePageInput>;
export type DeletePageOutput = Output<typeof DeletePageOutput>;
export type DeletePageError = ErrorResponse;
