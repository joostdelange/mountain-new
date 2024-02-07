import type { RouteRecordRaw } from 'vue-router';
import Default from '@/layouts/Default.vue';
import Blocks from '@/views/blocks/Blocks.vue';
import Block from '@/views/blocks/Block.vue';

const blocks: RouteRecordRaw = {
  path: '/blocks',
  component: Default,
  children: [
    {
      path: '',
      name: 'Blocks',
      component: Blocks,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'block/:id?',
          name: 'Block',
          component: Block,
        },
      ],
    },
  ],
};

export default blocks;
