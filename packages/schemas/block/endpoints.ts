import { array, omit, string, type Output } from 'valibot';
import { BlockSchema } from './entity';
import { ErrorResponseSchema, ErrorResponse } from '../error';

export const GetBlocksOutput = array(BlockSchema);

export const GetBlockInput = string();
export const GetBlockOutput = BlockSchema;

export const CreateBlockInput = omit(BlockSchema, ['PK', 'SK', 'updatedAt']);
export const CreateBlockOutput = GetBlockOutput;

export const UpdateBlockInput = omit(BlockSchema, ['updatedAt']);
export const UpdateBlockOutput = BlockSchema;

export const DeleteBlockInput = string();
export const DeleteBlockOutput = ErrorResponseSchema;

export type GetBlocksOutput = Output<typeof GetBlocksOutput>;
export type GetBlocksError = ErrorResponse;

export type GetBlockInput = Output<typeof GetBlockInput>;
export type GetBlockOutput = Output<typeof GetBlockOutput>;
export type GetBlockError = ErrorResponse;

export type CreateBlockInput = Output<typeof CreateBlockInput>;
export type CreateBlockOutput = Output<typeof CreateBlockOutput>;
export type CreateBlockError = ErrorResponse;

export type UpdateBlockInput = Output<typeof UpdateBlockInput>;
export type UpdateBlockOutput = Output<typeof UpdateBlockOutput>;
export type UpdateBlockError = ErrorResponse;

export type DeleteBlockInput = Output<typeof DeleteBlockInput>;
export type DeleteBlockOutput = Output<typeof DeleteBlockOutput>;
export type DeleteBlockError = ErrorResponse;
