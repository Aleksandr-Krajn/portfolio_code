import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import App from './App';
import generateRouter from './router';
import store from './store';
import i18n from "@/plugins/i18n";

/**
 * Подключение глобально всех компонентов ElementUI
 */
import '@/plugins/elementUI';

/**
 * Подключение axios к Vue классу.
 */
import '@/plugins/axios';

import Notification from '@/services/notification';
import checkPermission from '@/assets/js/permissions';

import '@/packages/z-elements/index';
import '@/assets/styles/main.scss';

Vue.config.productionTip = false;

window.bslNotice = Notification;

const router = generateRouter(store);
sync(store, router);

Vue.prototype.$perm = name => checkPermission(name, store);

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app');
