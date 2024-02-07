import { object, array, string, uuid, type Output } from 'valibot';
import { GetUserOutput, UpdateUserInput, UpdateUserOutput } from '../user';
import { SiteSchema } from '../site';
import { ErrorResponseSchema } from '../error';

export const GetMeOutput = object({
  ...GetUserOutput.entries,
  sites: array(SiteSchema),
  currentSiteId: string([uuid()]),
});

export const UpdateMeInput = UpdateUserInput;
export const UpdateMeOutput = object({
  ...UpdateUserOutput.entries,
  sites: array(SiteSchema),
  currentSiteId: string([uuid()]),
});

export type GetMeOutput = Output<typeof GetMeOutput>;
export type GetMeError = Output<typeof ErrorResponseSchema>;

export type UpdateMeInput = Output<typeof UpdateMeInput>;
export type UpdateMeOutput = Output<typeof UpdateMeOutput>;
