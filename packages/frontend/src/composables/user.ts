import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/valibot';
import { UserUpdateValidationSchema } from '@mountain-cms/schemas';

export const useValidatedUserUpdateForm = () => {
  const { errors, handleSubmit, defineField } = useForm<UserUpdateValidationSchema>({
    validationSchema: toTypedSchema(UserUpdateValidationSchema),
  });
  const [firstName] = defineField('firstName', { label: 'First name' });
  const [lastName] = defineField('lastName', { label: 'Last name' });
  const [email] = defineField('email', { label: 'Email' });

  return { errors, handleSubmit, firstName, lastName, email };
};
