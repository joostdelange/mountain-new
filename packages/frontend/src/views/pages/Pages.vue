<template lang="pug">
.pages
  DataTable(
    v-model:filters="filters"
    :value="pageStore.pages"
    :paginator="true"
    :rows="30"
  )
    template(#header)
      .flex.justify-end
        Button(:icon="PrimeIcons.PLUS" label="Add page" @click="router.push({ name: 'Page' })")
        InputText.ml-4(v-model="filters.global.value" placeholder="Search")
    Column(field="title" header="Title")
      template(#body="{ data }")
        RouterLink.decoration-none.text-blue-500(:to="{ name: 'Page', params: { id: data.pageId } }") {{ data.title }}
    Column(field="link" header="Link")
    Column(field="updatedAt" header="Updated at" :sortable="true")
      template(#body="{ data }")
        | {{ DateTime.fromSeconds(data.updatedAt).toFormat('dd-MM-yyyy HH:mm') }}
    Column.w-20(header="")
      template(#body="{ data }")
        i.p-1.decoration-none.text-red-500.cursor-pointer(
          :class="PrimeIcons.TRASH"
          @click="pageToDelete = data.pageId"
        )
        ConfirmPageDeleteModal(
          v-model="pageToDelete"
          :loading="deleteLoading"
          @delete="deletePage"
        )
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { DateTime } from 'luxon';
import { PrimeIcons, FilterMatchMode } from 'primevue/api';
import { usePageStore } from '@/stores/page';
import { useBreadcrumbs } from '@/composables/breadcrumbs';
import ConfirmPageDeleteModal from '@/components/page/ConfirmPageDeleteModal.vue';

const router = useRouter();
const pageStore = usePageStore();

const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const pageToDelete = ref<string | null>(null);
const deleteLoading = ref(false);

useBreadcrumbs([
  { label: 'Pages', link: { name: 'Pages' } },
]);

const deletePage = async (pageId: string) => {
  deleteLoading.value = true;
  await pageStore.deletePage(pageId);
  deleteLoading.value = false;
  pageToDelete.value = null;
};

await pageStore.getPages();
</script>
