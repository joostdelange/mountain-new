import { object, string, minLength, type Output } from 'valibot';

export const BlockUpsertValidationSchema = object({
  label: string([minLength(1, 'Label field is required')]),
  description: string([minLength(1, 'Description field is required')]),
});

export type BlockUpsertValidationSchema = Output<typeof BlockUpsertValidationSchema>;
