import type { RouteRecordRaw } from 'vue-router';
import Default from '@/layouts/Default.vue';
import Pages from '@/views/pages/Pages.vue';
import Page from '@/views/pages/page/Page.vue';

const pages: RouteRecordRaw = {
  path: '/pages',
  component: Default,
  children: [
    {
      path: '',
      name: 'Pages',
      component: Pages,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: 'page/:id?/:tab?',
      name: 'Page',
      component: Page,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

export default pages;
