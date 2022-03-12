import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/variables-element-ui.scss';
import i18n from '@/plugins/i18n';

Vue.use(ElementUI, { i18n: (key,  value) => i18n.t(key, value) });
