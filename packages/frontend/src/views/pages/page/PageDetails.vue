<template lang="pug">
label.block.my-2 Title
InputText.w-full(
  v-model="pageUpdateForm.title.value"
  :class="{ 'p-invalid': pageUpdateForm.errors.value.title }"
)
small.p-error.block.h-3.mt-1 {{ pageUpdateForm.errors.value.title }}
label.block.my-2 Link
InputText.w-full(
  v-model="pageUpdateForm.link.value"
  :class="{ 'p-invalid': pageUpdateForm.errors.value.link }"
)
small.p-error.block.h-3.mt-1 {{ pageUpdateForm.errors.value.link }}
label.block.my-2 Meta description
Textarea.w-full(
  v-model="pageUpdateForm.metaDescription.value"
  rows="5"
  :class="{ 'p-invalid': pageUpdateForm.errors.value.metaDescription }"
)
small.p-error.block.h-3.mt-1 {{ pageUpdateForm.errors.value.metaDescription }}
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { pageUpdateFormKey, pageSaveKey } from '@/injectionKeys/page';

const pageUpdateForm = inject(pageUpdateFormKey)!;
const save = inject(pageSaveKey)!;
</script>