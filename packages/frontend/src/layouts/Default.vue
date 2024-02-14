<template lang="pug">
.default.h-full.flex
  Menu.h-full.w-70.bg-gray-100.flex.flex-col.border-none.overflow-auto(
    :model="menuItems"
    :pt="menuPtOptions"
  )
    template(#start)
      RouterLink.flex.items-center.p-4.decoration-none(:to="{ name: 'Dashboard' }")
        Image.mr-2(:src="logo" image-class="w-10")
        h3.font-normal.text-dark.mt-0.mb-1 Mountain CMS
      .px-4
        Dropdown.w-full.bg-gray-200.border-none.mb-5(
          :model-value="userStore.me.currentSiteId"
          :options="userStore.me.sites"
          option-value="SK"
          option-label="name"
          :pt="dropdownPtOptions"
          :disabled="loading"
          class="hover:bg-gray-300"
          @update:model-value="switchSite"
        )
    template(#item="{ item }")
      RouterLink.p-menuitem-link.py-4(:to="item.link")
        span.p-menuitem-icon(:class="item.icon")
        span.p-menuitem-text {{ item.label }}
    template(#end)
      Menu.p-0(
        ref="userMenu"
        :model="userMenuItems"
        :popup="true"
      )
      .mt-4.relative.overflow-hidden.w-full.p-link.flex.items-center.px-4.py-2.transition(
        class="hover:bg-gray-200"
        @click="toggleUserMenu"
      )
        Avatar.mr-2 {{ userStore.me.firstName?.charAt(0) }}
        | {{ userStore.me.firstName }} {{ userStore.me.lastName }}
  .w-full(v-if="!loading")
    Breadcrumb.border-none.px-8.pt-8.pb-1(:model="miscStore.breadcrumbItems")
      template(#item="{ item }")
        Component.p-menuitem-link(:is="item.link ? 'RouterLink' : 'a'" :to="item.link")
          span.p-menuitem-text {{ item.label }}
    RouterView.w-full(class="md:p-8 lt-md:p-6")
  .w-full.h-full.flex.items-center(v-else)
    ProgressSpinner
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isAxiosError } from 'axios';
import { PrimeIcons } from 'primevue/api';
import type { MenuItem } from 'primevue/menuitem';
import type { GetMeError } from '@mountain-cms/schemas';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useMiscStore } from '@/stores/misc';
import { useLogout } from '@/composables/auth';
import logo from '../assets/logo.svg';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const userStore = useUserStore();
const miscStore = useMiscStore();
const logout = useLogout();

const dropdownPtOptions = {
  trigger: { class: 'hidden' },
  panel: { class: 'overflow-hidden' },
  list: { class: 'p-0' },
  item: { class: 'text-dark bg-white' },
};

const loading = ref(false);

const menuItems = ref<MenuItem[]>([
  { label: 'Dashboard', icon: PrimeIcons.HOME, link: { name: 'Dashboard' }, disabled: loading.value },
  { label: 'Blocks', icon: PrimeIcons.BOX, link: { name: 'Blocks' } },
  { label: 'Pages', icon: PrimeIcons.FILE, link: { name: 'Pages' }, disabled: loading.value },
  // { label: 'Menu', icon: PrimeIcons.BARS, link: { name: 'Menu' } },
  // { label: 'Media', icon: PrimeIcons.IMAGES, link: { name: 'Media' } },
  // { label: 'Forms', icon: PrimeIcons.CHECK_SQUARE, link: { name: 'Forms' } },
  // { label: 'Submissions', icon: PrimeIcons.ENVELOPE, link: { name: 'FormSubmssions' } },
]);

const menuPtOptions = {
  menu: { class: 'mb-auto border-none' },
  menuitem: { class: 'mb-2' },
  content: { class: 'transition hover:bg-gray-200' },
};

const userMenu = ref();
const userMenuItems = ref<MenuItem[]>([
  {
    label: 'Profile',
    icon: PrimeIcons.USER,
    command: () => router.push({ name: 'Profile' }),
    class: route.name === 'Profile' ? 'bg-gray-200' : '',
    disabled: loading.value,
  },
  {
    label: 'Logout',
    icon: PrimeIcons.SIGN_OUT,
    command: logout,
    disabled: loading.value,
  },
]);

const switchSite = async (siteId: string) => {
  if (userStore.me.currentSiteId == siteId) return false;

  loading.value = true;
  const response = await authStore.switchSiteRequest(siteId);
  if (response.status !== 200) return false;

  authStore.setToken(response.headers.authorization);

  await userStore.getMe();
  loading.value = false;

  return true;
};

const toggleUserMenu = (event: MouseEvent) => {
  userMenu.value.toggle(event);
};

const getMeResponse = await userStore.getMe();
const getMeError = isAxiosError<GetMeError>(getMeResponse);

if (getMeError && getMeResponse.response?.status === 401) {
  authStore.unsetToken();
  router.push({ name: 'Login' });
}
</script>