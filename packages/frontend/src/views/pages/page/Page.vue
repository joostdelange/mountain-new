<template lang="pug">
.page
  .flex.items-center.justify-between
    h1.my-0 {{ pageUpdateForm.title.value || 'Add page' }}
    .flex
      a.mr-2.text-gray-500.p-button.p-button-link(
        :href="previewLink"
        target="_blank"
      )
        | Preview
      Button.mx-2(
        v-tooltip.top="'Revert to the currently published version'"
        label="Revert"
        :outlined="true"
        :disabled="!pageStore.page.divertedFromPublished"
        :icon="PrimeIcons.UNDO"
        @click="revert"
      )
      Button.mx-2(
        label="Save"
        :disabled="Object.values(pageUpdateForm.errors.value).length > 0"
        :loading="loading.save"
        :icon="PrimeIcons.SAVE"
        @click="save"
      )
      Button.ml-2(
        label="Publish"
        severity="success"
        :loading="loading.publish"
        :icon="PrimeIcons.UPLOAD"
        :disabled="!pageStore.page.divertedFromPublished"
        @click="publish"
      )
  TabView.mt-4(:active-index="activeRouteTab" @tab-change="changeRouteTab")
    TabPanel(header="Details")
      PageDetails
    TabPanel(v-if="route.params.id" header="Content")
      PageBuilder
</template>

<script setup lang="ts">
import { ref, computed, provide, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { isAxiosError } from 'axios';
import { PrimeIcons } from 'primevue/api';
import type { TabViewChangeEvent } from 'primevue/tabview';
import type { UpdatePageError, CreatePageError } from '@mountain-cms/schemas';
import { useBreadcrumbs } from '@/composables/breadcrumbs';
import { usePageStore } from '@/stores/page';
import { useUserStore } from '@/stores/user';
import { useValidatedPageUpdateForm } from '@/composables/page';
import { pageUpdateFormKey, pageSaveKey } from '@/injectionKeys/page';
import PageBuilder from './PageBuilder.vue';
import PageDetails from './PageDetails.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const pageStore = usePageStore();
const userStore = useUserStore();

if (route.params.id) {
  const response = await pageStore.getPage(route.params.id);
  if (!response.data) router.push({ name: 'Pages' });
}

useBreadcrumbs([
  { label: 'Pages', link: { name: 'Pages' } },
  { label: pageStore.page.title || 'Add page' },
]);

const pageUpdateForm = useValidatedPageUpdateForm(pageStore.page);

const tabs = ['details', 'content'];
const loading = ref({
  revert: false,
  save: false,
  publish: false,
});
const previewLink = computed(() => {
  const path = `${!pageStore.page.link?.startsWith('/') ? '/' : ''}${pageStore.page.link}`;

  return `${userStore.currentSite?.url}${path}`;
});
const activeRouteTab = computed(() => {
  if (!route.params.tab || typeof route.params.tab !== 'string') return 0;

  return tabs.indexOf(route.params.tab);
});

const changeRouteTab = (value: TabViewChangeEvent) => router.push({ params: { tab: tabs[value.index] } });

const revert = async () => {
  loading.value.revert = true;

  const response = await pageStore.revertPage(pageStore.page.pageId);
  const isError = isAxiosError<CreatePageError>(response);

  toast.add({
    severity: !isError ? 'success' : 'error',
    detail: !isError ? 'Succesfully reverted page to published version' : response.response?.data.message,
    life: 5000,
  });

  pageUpdateForm.title.value = pageStore.page.title;
  pageUpdateForm.link.value = pageStore.page.link;
  pageUpdateForm.metaDescription.value = pageStore.page.metaDescription;

  loading.value.revert = false;
};

const save = pageUpdateForm.handleSubmit(async (values) => {
  loading.value.save = true;

  if (route.params.id) {
    const response = await pageStore.updatePage({
      ...pageStore.page,
      title: values.title,
      link: values.link,
      metaDescription: values.metaDescription,
    });
    const isError = isAxiosError<UpdatePageError>(response);

    toast.add({
      severity: !isError ? 'success' : 'error',
      detail: !isError ? 'Succesfully updated page' : response.response?.data.message,
      life: 5000,
    });
  } else {
    const response = await pageStore.createPage({
      ...pageStore.page,
      title: values.title,
      link: values.link,
      metaDescription: values.metaDescription,
    });
    const isError = isAxiosError<CreatePageError>(response);

    toast.add({
      severity: !isError ? 'success' : 'error',
      detail: !isError ? 'Succesfully created page' : response.response?.data.message,
      life: 5000,
    });

    if (!isError) {
      router.push({ name: 'Page', params: { id: response.data.pageId } });
    }
  }

  loading.value.save = false;
});

const publish = async () => {
  loading.value.publish = true;

  const response = await pageStore.publishPage(pageStore.page);
  const isError = isAxiosError<CreatePageError>(response);

  toast.add({
    severity: !isError ? 'success' : 'error',
    detail: !isError ? 'Succesfully published page' : response.response?.data.message,
    life: 5000,
  });

  loading.value.publish = false;
};

onBeforeUnmount(() => pageStore.page = { ...pageStore.defaultPage });

provide(pageUpdateFormKey, pageUpdateForm);
provide(pageSaveKey, save);
</script>
  