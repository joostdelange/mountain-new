import type { RouteRecordRaw } from 'vue-router';
import Default from '@/layouts/Default.vue';
import Dashboard from '@/views/dashboard/Dashboard.vue';

const dashboard: RouteRecordRaw = {
  path: '/dashboard',
  component: Default,
  children: [
    {
      path: '',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

export default dashboard;
