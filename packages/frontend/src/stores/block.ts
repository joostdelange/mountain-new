import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getDefaults } from 'valibot';
import { GetBlocksOutput, GetBlockInput, GetBlockOutput } from '@mountain-cms/schemas';
import { CreateBlockInput, CreateBlockOutput, UpdateBlockInput, UpdateBlockOutput } from '@mountain-cms/schemas';
import { DeleteBlockInput, DeleteBlockOutput } from '@mountain-cms/schemas';
import { api } from '@/http';

export const defaultBlock: GetBlockOutput = getDefaults(GetBlockOutput);

export const useBlockStore = defineStore('block', () => {
  const blocks = ref<GetBlocksOutput>([]);
  const block = ref<GetBlockOutput>({ ...defaultBlock });

  const getBlocks = async () => {
    const response = await api.get<GetBlocksOutput>('/blocks');
    if (response.data) blocks.value = response.data;

    return response;
  };

  const createBlock = async (payload: CreateBlockInput) => {
    const response = await api.post<CreateBlockOutput>('/blocks', payload);
    if (response.data) {
      block.value = response.data
      blocks.value.push(response.data);
      blocks.value.sort((a, b) => a.label.localeCompare(b.label));
    };

    return response;
  };

  const getBlock = async (blockId: GetBlockInput) => {
    const response = await api.get<GetBlockOutput>(`/blocks/${blockId}`);
    if (response.data) block.value = response.data;

    return response;
  };

  const updateBlock = async (payload: UpdateBlockInput) => {
    const response = await api.put<UpdateBlockOutput>(`/blocks/${payload.SK}`, payload);
    const index = blocks.value.findIndex((block) => block.SK === payload.SK);

    if (response.data) {
      block.value = response.data;
      blocks.value[index] = response.data;
      blocks.value.sort((a, b) => a.label.localeCompare(b.label));
    };

    return response;
  };

  const deleteBlock = async (blockId: DeleteBlockInput) => {
    const response = await api.delete<DeleteBlockOutput>(`/blocks/${blockId}`);
    const index = blocks.value.findIndex((block) => block.SK === blockId);
    if (response.data) blocks.value.splice(index, 1);

    return response;
  };

  return { blocks, block, getBlocks, createBlock, getBlock, updateBlock, deleteBlock };
});
