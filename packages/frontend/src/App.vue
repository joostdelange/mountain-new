<template lang="pug">
.h-full
  RouterView(v-slot="{ Component }")
    template(v-if="Component")
      Suspense(:timeout="0")
        template(#default)
          Component(:is="Component")
        template(#fallback)
          .w-full.h-full.flex.items-center.justify-center
            ProgressSpinner
  Toast(:pt="toastPassThroughOptions")
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import type { ToastPassThroughOptions } from 'primevue/toast';

const toastPassThroughOptions: ToastPassThroughOptions = {
  content: { class: 'p-2 items-center' },
  icon: { class: 'w-4 h-4' },
  detail: { class: 'important:m-0' },
}
</script>