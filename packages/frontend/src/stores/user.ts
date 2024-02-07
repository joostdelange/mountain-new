import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GetMeOutput, GetMeError, UpdateMeInput, UpdateMeOutput } from '@mountain-cms/schemas';
import { api } from '@/http';

export const useUserStore = defineStore('user', () => {
  const me = ref<GetMeOutput>({
    PK: 'user',
    SK: '',
    email: '',
    firstName: '',
    lastName: '',
    siteIds: [],
    sites: [],
    currentSiteId: '',
  });

  const currentSite = computed(() => me.value.sites.find((site) => site.SK === me.value.currentSiteId));

  const getMe = async () => {
    const response = await api.get<GetMeOutput>('/me');
    if (response.data?.PK) me.value = response.data;

    return response;
  };
  
  const updateMe = async (payload: UpdateMeInput) => {
    const response = await api.put<UpdateMeOutput>('/me', payload);
    if (response.data?.PK) me.value = response.data;

    return response;
  };

  return { me, currentSite, getMe, updateMe };
});
