<template lang="pug">
.dashboard
</template>

<script setup lang="ts">
import { useBreadcrumbs } from '@/composables/breadcrumbs';

useBreadcrumbs([
  { label: '', link: { name: 'Dashboard' } },
]);
</script>
