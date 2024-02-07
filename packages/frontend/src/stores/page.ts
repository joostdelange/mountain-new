import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getDefaults } from 'valibot';
import { GetPagesOutput, GetPageOutput } from '@mountain-cms/schemas';
import { UpdatePageInput, UpdatePageOutput, CreatePageInput } from '@mountain-cms/schemas';
import { DeletePageInput, DeletePageOutput } from '@mountain-cms/schemas';
import { api } from '@/http';

export const usePageStore = defineStore('page', () => {
  const pages = ref<GetPagesOutput>([]);
  const defaultPage: GetPageOutput = getDefaults(GetPageOutput);
  const page = ref<GetPageOutput>({ ...defaultPage });

  const getPages = async () => {
    const response = await api.get<GetPagesOutput>('/pages');
    pages.value = response.data;

    return response;
  };

  const createPage = async (payload: CreatePageInput) => {
    const response = await api.post<GetPageOutput>('/pages', payload);
    if (response.data) page.value = response.data;

    return response;
  };

  const getPage = async (id: string | string[]) => {
    const response = await api.get<GetPageOutput>(`/pages/${id}`);
    if (response.data) page.value = response.data;

    return response;
  };

  const updatePage = async (payload: UpdatePageInput) => {
    const response = await api.put<UpdatePageOutput>(`/pages/${payload.pageId}`, payload);
    if (response.data) page.value = response.data;

    return response;
  };

  const publishPage = async (payload: UpdatePageInput) => {
    const response = await api.put<UpdatePageOutput>(`/pages/${payload.pageId}/publish`, payload);
    if (response.data) page.value = response.data;

    return response;
  };

  const revertPage = async (pageId: string) => {
    const response = await api.put<UpdatePageOutput>(`/pages/${pageId}/revert`);
    if (response.data) page.value = response.data;

    return response;
  };

  const deletePage = async (pageId: DeletePageInput) => {
    const response = await api.delete<DeletePageOutput>(`/pages/${pageId}`);
    if (response.data) {
      const index = pages.value.findIndex((page) => page.pageId === pageId);

      pages.value.splice(index, 1);
    }

    return response;
  };

  return { pages, page, defaultPage, getPages, createPage, getPage, updatePage, publishPage, revertPage, deletePage };
});
