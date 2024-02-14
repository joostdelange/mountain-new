<template lang="pug">
.w-full
  DataView(
    :value="blockStore.blocks.filter((block) => block.label.toLowerCase().includes(search.toLowerCase()))"
    :pt="{ header: { class: 'bg-transparent border-none' } }"
    data-key="SK"
    layout="grid"
  )
    template(#header)
      .flex.justify-end
        Button.mr-4(
          label="Add Block"
          :icon="PrimeIcons.PLUS"
          @click="router.push({ name: 'Block' })"
        )
        InputText(v-model="search" placeholder="search")
    template(#grid="{ items }")
      .flex.flex-wrap.border-box.my-4
        Card.shadow-lg.shadow-gray-200.my-4.m-4-nth-4.cursor-pointer.transition-shadow(
          v-for="item in items"
          :key="item.SK"
          :pt="{ content: { class: 'py-0' }, body: { class: 'px-8 pt-4 pb-8' } }"
          class="hover:shadow-gray-300"
          @click="router.push({ name: 'Block', params: { id: item.SK } })"
        )
          template(#header)
            .flex.justify-between.items-center.px-8.pt-8.pb-4
              h2.m-0 {{ item.label }}
              Tag(:severity="item.siteId ? 'danger' : 'primary'" :rounded="true")
                | {{ item.siteId ? 'Custom' : 'Standard' }}
          template(#content) {{ item.description }}
  Sidebar.w-50vw(
    :visible="route.name === 'Block'"
    position="right"
    @update:visible="router.push({ name: 'Blocks' })"
  )
    template(#container)
      RouterView(v-slot="{ Component }")
        template(v-if="Component")
          Suspense(:timeout="0")
            template(#default)
              Component(:is="Component")
            template(#fallback)
              ProgressSpinner.w-full.h-full.flex.items-center.justify-center
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PrimeIcons } from 'primevue/api';
import { useBreadcrumbs } from '@/composables/breadcrumbs';
import { useBlockStore } from '@/stores/block';

useBreadcrumbs([
  { label: 'Blocks', link: { name: 'Blocks' } },
]);

const route = useRoute();
const router = useRouter();
const blockStore = useBlockStore();

const search = ref('');

await blockStore.getBlocks();
</script>
