import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/valibot';
import { BlockUpsertValidationSchema } from '@mountain-cms/schemas';
import type { GetBlockOutput } from '@mountain-cms/schemas';

export const useValidatedBlockUpsertForm = (initialValues: GetBlockOutput) => {
  const { errors, handleSubmit, values, defineField } = useForm<BlockUpsertValidationSchema>({
    initialValues,
    validationSchema: toTypedSchema(BlockUpsertValidationSchema),
  });
  const [label] = defineField('label', { label: 'Label' });
  const [description] = defineField('description', { label: 'Description' });

  return { errors, handleSubmit, label, description, values };
};
