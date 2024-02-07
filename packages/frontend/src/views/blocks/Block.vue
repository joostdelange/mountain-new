<template lang="pug">
.p-sidebar-header
  .p-sidebar-header-content.flex.items-center
    h3.m-0 Block: {{ blockUpsertForm.label.value }}
    span.ml-2.text-gray.font-size-4.fw-400(v-if="blockUpsertForm.label.value")
      | ({{ blockUpsertForm.label.value.toLowerCase().replace(/ /g, '_') }})
    Tag.ml-4(
      :severity="!blockStore.block.SK || blockStore.block.siteId ? 'danger' : 'primary'"
      :rounded="true"
    )
      | {{ !blockStore.block.SK || blockStore.block.siteId ? 'Custom' : 'Standard' }}
.p-sidebar-content.pt-5
  label.block.mb-2 Label
  .flex.items-center
    InputText.mr-4(
      v-model="blockUpsertForm.label.value"
      class="w-50%"
      :class="{ 'p-invalid': blockUpsertForm.errors.value.label }"
    )
    .text-gray(v-if="blockUpsertForm.label.value") ({{ blockUpsertForm.label.value.toLowerCase().replace(/ /g, '_') }})
  small.p-error.block.h-3.mt-1.mb-2 {{ blockUpsertForm.errors.value.label }}
  label.block.mb-2 Description
  InputText(
    v-model="blockUpsertForm.description.value"
    class="w-50%"
    :class="{ 'p-invalid': blockUpsertForm.errors.value.description }"
  )
  small.p-error.block.h-3.mt-1 {{ blockUpsertForm.errors.value.description }}
  h3.flex.items-center.mt-4.mb-2
    | Fields
    i.text-gray.p-2.cursor-pointer(
      :class="PrimeIcons.PLUS_CIRCLE"
      @click="addBlockField"
    )
  .flex.items-center.mb-4(v-for="(field, fieldIndex) in blockStore.block.fields" :key="field.name")
    Dropdown.mr-4(
      v-model="field.type"
      :options="blockFieldTypeOptions"
    )
    InputText.w-full.mr-4.flex-self-stretch(
      v-model="field.label"
      placeholder="Label"
    )
    i.text-gray.p-2.cursor-pointer(
      :class="PrimeIcons.TRASH"
      @click="deleteBlockField(fieldIndex)"
    )
.p-sidebar-end.p-5(v-if="userStore.me.role === UserRole.ADMIN")
  Button.mr-4(
    label="Save"
    :disabled="Object.values(blockUpsertForm.errors.value).length > 0"
    :icon="PrimeIcons.SAVE"
    :loading="saving"
    @click="save"
  )
  Button.mr-4(
    label="Cancel"
    :outlined="true"
    @click="router.push({ name: 'Blocks' })"
  )
  Button.mr-4(
    v-if="route.params.id"
    :icon="PrimeIcons.TRASH"
    :outlined="true"
    severity="danger"
    @click="deleteBlockModal = true"
  )
  ConfirmBlockDeleteModal(
    v-model="deleteBlockModal"
    :loading="deleting"
    @delete="deleteBlock"
  )
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import { useToast } from 'primevue/usetoast';
import { PrimeIcons } from 'primevue/api';
import { BlockFieldType, UserRole } from '@mountain-cms/schemas';
import type { CreateBlockError, UpdateBlockError, DeleteBlockError } from '@mountain-cms/schemas';
import { useBlockStore, defaultBlock } from '@/stores/block';
import { useUserStore } from '@/stores/user';
import { useValidatedBlockUpsertForm } from '@/composables/block';
import ConfirmBlockDeleteModal from '@/components/block/ConfirmBlockDeleteModal.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const blockStore = useBlockStore();
const userStore = useUserStore();

if (route.params.id) {
  await blockStore.getBlock(route.params.id as string);
}

const blockUpsertForm = useValidatedBlockUpsertForm(blockStore.block);

const saving = ref(false);
const deleteBlockModal = ref(false);
const deleting = ref(false);

const blockFieldTypeOptions = computed(() => Object.values(BlockFieldType));

const addBlockField = () => {
  blockStore.block.fields.push({
    label: '',
    name: '',
    type: BlockFieldType.TEXT,
  });
};

const deleteBlockField = (fieldIndex: number) => {
  blockStore.block.fields.splice(fieldIndex, 1);
};

const save = blockUpsertForm.handleSubmit(async (values) => {
  saving.value = true;

  if (route.params.id) {
    const response = await blockStore.updateBlock({
      ...blockStore.block,
      label: values.label,
      description: values.description,
    });
    const isError = isAxiosError<UpdateBlockError>(response);
    toast.add({
      severity: !isError ? 'success' : 'error',
      detail: !isError ? 'Succesfully updated block' : response.response?.data.message,
      life: 5000,
    });
  } else {
    const response = await blockStore.createBlock(blockStore.block);
    const isError = isAxiosError<CreateBlockError>(response);
    toast.add({
      severity: !isError ? 'success' : 'error',
      detail: !isError ? 'Succesfully created block' : response.response?.data.message,
      life: 5000,
    });
  }

  saving.value = false;
  router.push({ name: 'Blocks' });
});

const deleteBlock = async () => {
  deleting.value = true;

  if (route.params.id) {
    const response = await blockStore.deleteBlock(blockStore.block.SK);
    const isError = isAxiosError<DeleteBlockError>(response);
    toast.add({
      severity: !isError ? 'success' : 'error',
      detail: !isError ? 'Succesfully deleted block' : response.response?.data.message,
      life: 5000,
    });
  }

  deleting.value = false;
  router.push({ name: 'Blocks' });
};

onUnmounted(() => {
  blockStore.block = defaultBlock;
});
</script>