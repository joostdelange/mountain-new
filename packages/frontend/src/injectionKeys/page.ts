import type { InjectionKey } from 'vue';
import { useValidatedPageUpdateForm } from '@/composables/page';

export const pageSaveKey = Symbol() as InjectionKey<() => void>;
export const pageUpdateFormKey = Symbol() as InjectionKey<ReturnType<typeof useValidatedPageUpdateForm>>;
