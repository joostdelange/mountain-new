import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { apiUrl } from '../../../../outputs.json';

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (config) => config,
  (error) => error,
);

export { api };
