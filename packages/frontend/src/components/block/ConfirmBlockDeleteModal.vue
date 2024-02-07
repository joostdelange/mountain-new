<template lang="pug">
Dialog(
  :visible="modelValue"
  :modal="true"
  :dismissable-mask="true"
  class="w-25%"
  @update:visible="$emit('update:modelValue', null)"
)
  template(#header)
    h2.font-normal.text-dark.my-0.mr-10 Delete block
  template(#default)
    p
      | Are you sure you want to delete this block?
      | This action cannot be undone.
  template(#footer)
    Button(
      v-if="modelValue"
      label="Delete block"
      severity="danger"
      :icon="loading ? PrimeIcons.SPINNER : undefined"
      :loading="loading"
      @click="$emit('delete')"
    )
</template>

<script setup lang="ts">
import { PrimeIcons } from 'primevue/api';

defineProps<{
  modelValue: boolean,
  loading: boolean,
}>();
defineEmits<{
  (e: 'update:modelValue', value: string | null): void,
  (e: 'delete'): void,
}>();
</script>