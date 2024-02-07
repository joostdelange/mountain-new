import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/valibot';
import { PageUpdateValidationSchema } from '@mountain-cms/schemas';
import type { GetPageOutput } from '@mountain-cms/schemas';

export const useValidatedPageUpdateForm = (initialValues: GetPageOutput) => {
  const { errors, handleSubmit, values, defineField } = useForm<PageUpdateValidationSchema>({
    initialValues,
    validationSchema: toTypedSchema(PageUpdateValidationSchema),
  });
  const [title] = defineField('title', { label: 'Title' });
  const [link] = defineField('link', { label: 'Link' });
  const [metaDescription] = defineField('metaDescription', { label: 'metaDescription' });

  return { errors, handleSubmit, title, link, metaDescription, values };
};
