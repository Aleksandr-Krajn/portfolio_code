const state = () => ({
  breadcrumbs: []
});

const mutations = {
  setBreadcrumbs(state, breadcrumbsArray) {
    state.breadcrumbs = breadcrumbsArray
  }
}

export default {
  namespaced: true,
  state,
  // actions,
  mutations,
  // getters
}