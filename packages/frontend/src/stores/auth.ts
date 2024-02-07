import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../http';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null);

  const setToken = (value: string) => {
    token.value = value;
    localStorage.setItem('token', value);
  };

  const unsetToken = () => {
    token.value = null;
    localStorage.removeItem('token');
  }
  
  const sendLoginRequest = async (email: string) => 
    api.get('/auth/code/request', { params: { email } });

  const completeLoginRequest = async (email: string, code: string) =>
    api.get('/auth/code/complete', { params: { email, code } });

  const switchSiteRequest = async (siteId: string) =>
    api.get('/auth/code/switch-site', { params: { siteId } });

  return { token, setToken, unsetToken, sendLoginRequest, completeLoginRequest, switchSiteRequest };
});
