<template lang="pug">
Dialog(
  :visible="!!modelValue"
  :modal="true"
  :dismissable-mask="true"
  class="w-50%"
  @update:visible="emit('update:modelValue', false)"
)
  template(#header)
    h2.font-normal.text-dark.my-0.mr-10 Choose a block type
  template(#default)
    .flex.flex-wrap
      Card.shadow-lg.shadow-gray-200.m-4-nth-4.cursor-pointer.transition-shadow(
        v-for="block in blockStore.blocks"
        :key="block.SK"
        :pt="cardPassThroughOptions"
        class="hover:shadow-gray-300"
        @click="emit('add', block.SK)"
      )
        template(#content)
          .flex.flex-col.items-center.justify-center.aspect-square
            h2.m-0.fw-500 {{ block.label }}
  template(#footer)
    Button(
      v-if="modelValue"
      label="Cancel"
      @click="$emit('update:modelValue', false)"
    )
</template>

<script setup lang="ts">
import type { CardPassThroughOptions } from 'primevue/card';
import { useBlockStore } from '@/stores/block';

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
  (e: 'add', value: string): void,
}>();

const blockStore = useBlockStore();
const cardPassThroughOptions: CardPassThroughOptions = {
  header: { class: 'p-4' },
  body: { class: 'px-4 pb-4 pt-0' },
  content: { class: 'p-0' },
};

if (!blockStore.blocks.length) {
  await blockStore.getBlocks();
}
</script>