<template lang="pug">
Dialog(
  :visible="!!modelValue"
  :modal="true"
  :dismissable-mask="true"
  class="w-25%"
  @update:visible="$emit('update:modelValue', null)"
)
  template(#header)
    h2.font-normal.text-dark.my-0.mr-10 Delete page
  template(#default)
    p
      | Are you sure you want to delete this page?
      | Both the concept &amp; published version will be deleted,
      | this action cannot be undone.
  template(#footer)
    Button(
      v-if="modelValue"
      label="Delete page"
      severity="danger"
      :icon="loading ? PrimeIcons.SPINNER : undefined"
      :loading="loading"
      @click="$emit('delete', modelValue)"
    )
</template>

<script setup lang="ts">
import { PrimeIcons } from 'primevue/api';

defineProps<{
  modelValue: string | null,
  loading: boolean,
}>();
defineEmits<{
  (e: 'update:modelValue', value: string | null): void,
  (e: 'delete', value: string): void,
}>();
</script>