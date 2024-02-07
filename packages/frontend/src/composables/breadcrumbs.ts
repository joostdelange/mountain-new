import type { MenuItem } from 'primevue/menuitem';
import { useMiscStore } from '@/stores/misc';

export const useBreadcrumbs = (items: MenuItem[]) => {
  const miscStore = useMiscStore();

  miscStore.breadcrumbItems = [
    { label: 'Dashboard', link: { name: 'Dashboard' } },
    ...items,
  ];
};
