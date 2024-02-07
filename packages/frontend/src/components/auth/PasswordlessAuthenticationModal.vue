<template lang="pug">
Dialog(
  :visible="modelValue"
  :modal="true"
  :dismissable-mask="true"
  class="w-25%"
  @update:visible="$emit('update:modelValue', false)"
)
  template(#header)
    h2.font-normal.text-dark.my-0.mr-10 Passwordless login
  template(#default)
    p 
      | Experience a more secure and convenient login with passwordless login.
    p
      | Simply enter your email address, and we'll send you a link to verify your login.
      | This eliminates having to enter a password and improves overall security.
</template>

<script setup lang="ts">
defineProps<{ modelValue?: boolean }>();
defineEmits<{ (e: 'update:modelValue', value: boolean): void }>();
</script>