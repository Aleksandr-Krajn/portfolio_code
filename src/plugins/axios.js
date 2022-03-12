import Vue from 'vue'
import axios from '@/services/axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

Vue.prototype.$axios = axios;