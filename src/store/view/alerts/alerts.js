const state = () => ({
  allAlerts: []
});

const actions = {
  
};

const mutations = {
  add(state, alert) {
    alert.id = Symbol()

    state.allAlerts.push(alert)

    if(alert.timeout){
      this.commit('Alerts/timeDelete', { id: alert.id, timeout: alert.timeout })
    }
  },

  timeDelete(state, { id, timeout }) {
    const time = setTimeout(() => {
      this.commit('Alerts/delete', id)
      
      clearTimeout(time)
    }, timeout)
  },

  delete(state, id) {
    state.allAlerts.forEach((alert, index) => {
      if(alert.id == id) {
        state.allAlerts.splice(index, 1)
      }
    });
  }
};

const getters = {
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}