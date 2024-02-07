import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { toTypedSchema } from '@vee-validate/valibot';
import { LoginRequestValidationSchema, LoginCompleteValidationSchema } from '@mountain-cms/schemas';
import { useAuthStore } from '@/stores/auth';

export const useValidatedLoginRequestForm = () => {
  const { errors, handleSubmit, defineField, setFieldValue } = useForm<LoginRequestValidationSchema>({
    validationSchema: toTypedSchema(LoginRequestValidationSchema),
  });
  const [email] = defineField('email', { label: 'Email' });
  setFieldValue('email', '');

  return { errors, handleSubmit, email };
};

export const useValidatedLoginCompleteForm = () => {
  const { errors, handleSubmit, isSubmitting, defineField, setFieldValue } = useForm<LoginCompleteValidationSchema>({
    validationSchema: toTypedSchema(LoginCompleteValidationSchema),
  });
  const [code] = defineField('code', { label: 'Code' });
  setFieldValue('code', '');

  return { errors, handleSubmit, isSubmitting, code };
};

export const useLogout = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const logout = () => {
    authStore.unsetToken();

    router.replace({ name: 'Login' });
  };

  return logout;
};
