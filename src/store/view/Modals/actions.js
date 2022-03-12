import * as $ from './actions-types.js';
import * as _ from './mutations-types.js';

export default {
  [$.CREATE_MODAL]({ commit }, modalData) {
    const newModalID = Symbol();
    commit(_.ADD_MODAL, { id: newModalID, ...modalData });

    return newModalID;
  },
};