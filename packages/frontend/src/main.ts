import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import App from './App.vue';
import router from './router';
import useVeeValidateConfig from './configs/vee-validate';
import useQuillConfig from './configs/quill';

import 'modern-normalize/modern-normalize.css';
import 'virtual:uno.css';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';
import './assets/main.css';

useVeeValidateConfig();
useQuillConfig();

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(ToastService);
app.directive('tooltip', Tooltip);

app.mount('#app');
