<template lang="pug">
.login
  form(@submit.prevent="(!submitted ? loginSubmit() : completeSubmit())")
    Card.shadow-lg(md:w-150 sm:w-100)
      template(#header)
        .w-full.flex.items-center.flex-col.px-5.pt-5
          Image(:src="logo" image-class="w-12")
          h2.font-normal.text-dark.mt-3.mb-0 {{ !submitted ? 'Welcome back, login below' : 'Complete the login below' }}
      template(v-if="!submitted" #content)
        label.block.mb-2.text-dark Email
        InputText.w-full(
          v-model="loginRequestForm.email.value"
          placeholder="Email address"
          :autofocus="true"
          :class="{ 'p-invalid': loginRequestForm.errors.value.email }"
        )
        small.p-error.block.h-4.mt-1 {{ loginRequestForm.errors.value.email }}
        .flex.justify-right.-mt-3
          Button.p-0.text-gray.shadow-none(:link="true" @click="passwordExplainModal = true") Where is the password field?
          PasswordlessAuthenticationModal(v-model="passwordExplainModal")
      template(v-else #content)
        p.mt-0.mb-8
          | An email with a code has been sent to your inbox,
          | fill the code in the email into the field below.
        label.block.mb-2.text-dark Code
        InputText.w-full(
          v-model="loginCompleteForm.code.value"
          placeholder="Code"
          :class="{ 'p-invalid': loginCompleteForm.errors.value.code }"
        )
        small.p-error.block.h-4.mt-1 {{ loginCompleteForm.errors.value.code }}
      template(#footer)
        Button.w-full.justify-center(
          v-if="!submitted"
          type="submit"
          label="Request login"
          :icon="PrimeIcons.ENVELOPE"
          icon-class="position-absolute left-5"
          :loading="loading"
        )
        Button.w-full.justify-center(
          v-else
          type="submit"
          label="Complete login"
          :loading="loading"
        )
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { PrimeIcons } from 'primevue/api';
import logo from '@/assets/logo.svg';
import { useAuthStore } from '@/stores/auth';
import { useValidatedLoginRequestForm, useValidatedLoginCompleteForm } from '@/composables/auth';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const loginRequestForm = useValidatedLoginRequestForm();
const loginCompleteForm = useValidatedLoginCompleteForm();

const loading = ref(false);
const submitted = ref(false);
const passwordExplainModal = ref(false);

const loginSubmit = loginRequestForm.handleSubmit(async (values) => {
  loading.value = true;
  const response = await authStore.sendLoginRequest(values.email);
  loading.value = false;

  switch (response.status) {
    case 200:
      submitted.value = true;

      break;
    default:
      toast.add({
        severity: 'error',
        detail: 'Error requesting login',
        life: 5000,
      });

      break;
  }
});

const completeSubmit = loginCompleteForm.handleSubmit(async (values) => {
  loading.value = true;
  const response = await authStore.completeLoginRequest(loginRequestForm.email.value, values.code);
  loading.value = false;

  switch (response.status) {
    case 200:
      authStore.setToken(response.headers.authorization);
      router.replace({ name: 'Dashboard' });

      break;
    case 401:
      toast.add({
        severity: 'error',
        detail: response.data.message,
        life: 5000,
      });

      break;
    default:
      toast.add({
        severity: 'error',
        detail: 'Error completing login',
        life: 5000,
      });

      break;
  }
});
</script>
