import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { MenuItem } from 'primevue/menuitem';

export const useMiscStore = defineStore('misc', () => {
  const breadcrumbItems = ref<MenuItem[]>([]);

  return { breadcrumbItems };
});
