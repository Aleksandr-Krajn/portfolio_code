import Vue from 'vue'

import ZArrowBtn from './z-arrow-btn/ZArrowBtn'
import ZBtn from './z-btn/ZBtn'
import ZOn from './z-on/ZOn'
import ZTableCheckbox from './z-table-checkbox/ZTableCheckbox'

const components = {
  'z-arrow-btn': ZArrowBtn,
  'z-btn': ZBtn,
  'z-on': ZOn,
  'z-table-checkbox': ZTableCheckbox,
}

Object.entries(components).forEach(([name, component]) => Vue.component(name, component))