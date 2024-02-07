import type { RouteRecordRaw } from 'vue-router';
import Default from '@/layouts/Default.vue';
import Profile from '@/views/profile/Profile.vue';

const profile: RouteRecordRaw = {
  path: '/profile',
  component: Default,
  children: [
    {
      path: '',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true,
      },
    },
  ],
};

export default profile;
