/**
 * Проверка на существование drawer в хранилище
 * 
 * @param {Object} state хранилище
 * @param {String} module назание модуля
 * @param {String} drawer название drawer
 * @returns {Boolean}
 */
const isExistDrawer = function (state, module, drawer) {
  return state && state[module] && (drawer in state[module]);
};

const state = () => ({
  administration: {
    roleEditor: null,
    userEditor: null,
  },
});

const mutations = {
  /**
   * Метод инициализации конкретного drawer
   * @param {String} module Имя модуля
   * @param {String} drawer Имя drawer
   * @param {Object} data передаваемые данные
   */
  openDrawer(state, { module, drawer, data = null }) {
    if (isExistDrawer(state, module, drawer)) { 
      state[module][drawer] = { data };
    }
  },

  /**
   * Метод уничтожения конкретного drawer
   * @param {String} module Имя модуля
   * @param {String} drawer Имя drawer
   */
  closeDrawer(state, { module, drawer }) {
    if (isExistDrawer(state, module, drawer)) {
      state[module][drawer] = null;
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}