import type { RouteRecordRaw } from 'vue-router';
import Auth from '@/layouts/Auth.vue';
import Login from '@/views/auth/Login.vue';

const auth: RouteRecordRaw = {
  path: '/auth',
  component: Auth,
  children: [
    {
      path: 'login',
      name: 'Login',
      component: Login,
    },
  ],
};

export default auth;
