<template lang="pug">
.page-builder
  .flex.items-center.justify-end.mb-3
    Button(:icon="PrimeIcons.PLUS" label="Add block" @click="addPageBlockModal = true")
  DataTable(
    :value="pageStore.page.blocks"
    :pt="blockPassThroughOptions"
    @row-reorder="setBlockOrder"
  )
    Column.flex.justify-between.py-4.px-3.my-2.bg-gray-100.rd.border-1.border-gray-200.border-solid(header="content")
      template(#body="{ data, index }")
        .flex.items-center
          i.text-gray-300.pi.pi-bars.ml-2.mr-4.cursor-move(data-pc-section="rowreordericon")
          span {{ data.block.label }}
        .flex-items-center
          i.text-gray-400.pi.pi-pencil.mr-4.cursor-pointer(@click="data.modal = true")
          i.text-gray-400.pi.pi-trash.mr-2.cursor-pointer(@click="deleteBlock(index)")
        Sidebar.w-50vw(v-model:visible="data.modal" position="right")
  AddPageBlockModal(v-model="addPageBlockModal" @add="addBlock")
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { DataTablePassThroughOptions } from 'primevue/datatable';
import { PrimeIcons } from 'primevue/api';
import { GetPageOutput } from '@mountain-cms/schemas';
import { usePageStore } from '@/stores/page';
import { useBlockStore } from '@/stores/block';
import AddPageBlockModal from '@/components/page/AddPageBlockModal.vue';

const pageStore = usePageStore();
const blockStore = useBlockStore();

const addPageBlockModal = ref(false);

const blockPassThroughOptions: DataTablePassThroughOptions = {
  headerRow: { class: 'hidden' },
};

const addBlock = (blockId: string) => {
  const matchingBlock = blockStore.blocks.find((block) => block.SK === blockId);

  pageStore.page.blocks.push({
    blockId,
    block: matchingBlock,
    position: pageStore.page.blocks.length,
  });
  addPageBlockModal.value = false;
};

const setBlockOrder = (event: { value: GetPageOutput['blocks'] }) => {
  pageStore.page.blocks = event.value.map((block, index) => ({ ...block, position: index }));
};

const deleteBlock = (blockIndex: number) => {
  const pageBlockIndex = pageStore.page.blocks.findIndex((_, index) => index === blockIndex);

  pageStore.page.blocks.splice(pageBlockIndex, 1);

  setBlockOrder({ value: pageStore.page.blocks });
}
</script>
