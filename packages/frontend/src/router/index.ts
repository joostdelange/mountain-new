import { createRouter, createWebHistory } from 'vue-router';
import auth from './auth';
import dashboard from './dashboard';
import profile from './profile';
import blocks from './blocks';
import pages from './pages';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:(.*)*',
      name: 'NotFound',
      redirect: () => ({ name: 'Login' }),
    },
    auth,
    dashboard,
    profile,
    blocks,
    pages,
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (!authStore.token && to.meta.requiresAuth) {
    return next({ name: 'Login' });
  }

  if (authStore.token && !to.meta.requiresAuth && from.name !== to.name) {
    return next({ name: 'Dashboard' });
  }

  return next();
});

export default router;
