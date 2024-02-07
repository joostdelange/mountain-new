<template lang="pug">
.profile.flex.justify-center.items-center
  form(@submit.prevent="save")
    Card.shadow-lg(v-if="userStore.me.SK" md:w-120 sm:w-100)
      template(#title)
        .flex.items-center
          | Profile
          Chip.ml-2.px-2.h-6.font-size-3.capitalize(:label="userStore.me.role")
      template(#content)
        .grid.grid-cols-2
          .pr-2
            label.block.mb-2.text-dark First name
            InputText.w-full(
              v-model="firstName"
              placeholder="First name"
              :class="{ 'p-invalid': errors.firstName }"
            )
            small.p-error.block.h-4.my-1 {{ errors.firstName }}
          .pl-2
            label.block.mb-2.text-dark Last name
            InputText.w-full(
              v-model="lastName"
              placeholder="Last name"
              :class="{ 'p-invalid': errors.lastName }"
            )
            small.p-error.block.h-4.my-1 {{ errors.lastName }}
        label.block.mb-2.text-dark Email
        InputText.w-full(
          v-model="email"
          placeholder="Email address"
          :class="{ 'p-invalid': errors.email }"
        )
        small.p-error.block.h-4.mt-1 {{ errors.email }}
        label.block.mb-2.text-dark Connected sites ({{ siteIds?.length }})
        MultiSelect.w-full(
          v-model="siteIds"
          :options="sites"
          option-label="name"
          option-value="SK"
          option-disabled="disabled"
          :show-toggle-all="false"
          :auto-option-focus="false"
        )
      template(#footer)
        .flex.justify-end
          Button(
            type="submit"
            label="Save"
            :icon="PrimeIcons.SAVE"
            :loading="loading"
          )
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { isAxiosError } from 'axios';
import { useToast } from 'primevue/usetoast';
import { PrimeIcons } from 'primevue/api';
import type { UpdateUserError } from '@mountain-cms/schemas';
import { useUserStore } from '@/stores/user';
import { useValidatedUserUpdateForm } from '@/composables/user';

const userStore = useUserStore();
const toast = useToast();
const { errors, handleSubmit, firstName, lastName, email } = useValidatedUserUpdateForm();

const siteIds = ref(userStore.me.siteIds);
const loading = ref(false);

const sites = computed(() => userStore.me.sites.map((site) => ({ ...site, disabled: true })));

const save = handleSubmit(async (values) => {
  loading.value = true;
  userStore.me = { ...userStore.me, ...values };

  const response = await userStore.updateMe({
    ...userStore.me,
    siteIds: siteIds.value,
  });

  toast.add({
    severity: !isAxiosError<UpdateUserError>(response) ? 'success' : 'error',
    detail: !isAxiosError<UpdateUserError>(response) ? 'Succesfully updated profile' : response.response?.data.message,
    life: 5000,
  });

  loading.value = false;
});

onMounted(() => {
  firstName.value = userStore.me.firstName || '';
  lastName.value = userStore.me.lastName || '';
  email.value = userStore.me.email || '';
});
</script>