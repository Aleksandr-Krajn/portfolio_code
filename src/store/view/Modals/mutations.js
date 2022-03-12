import * as _ from './mutations-types.js';

export default {
  [_.ADD_MODAL](state, modalData) {
    state.modals.push(modalData);
  },

  [_.UPDATE_MODAL](state, { id, value }) {
    const index = state.modals.findIndex((m) => m.id === id);
    if (~index) {
      const oldValueModal = state.modals[index];
      state.modals.splice(index, 1, { ...oldValueModal, ...value });
    }
  },

  [_.REMOVE_MODALS](state, id = null) {
    if (id === null) {
      state.modals = [];
    } else {
      const index = state.modals.findIndex((m) => m.id === id);
      if (~index) {
        state.modals.splice(index, 1);
      }
    }
  },
};