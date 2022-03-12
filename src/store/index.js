import Vue from 'vue'
import Vuex from 'vuex'

import Authorization from './modules/authorization/authorization'
import Administration from '@/store/modules/administration'

import Alerts from './view/alerts/alerts'
import Drawers from './view/drawers/drawers'
import Breadcrumbs from './view/breadcrumbs/breadcrumbs'
import Modals from '@/store/view/Modals'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Authorization,
    Administration,

    Alerts,
    Drawers,
    Breadcrumbs,

    Modals,
  }
});