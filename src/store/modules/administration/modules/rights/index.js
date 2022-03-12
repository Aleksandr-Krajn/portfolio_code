import { axios, urlEditor } from '@/services/axios';
import adminURL from  '@/assets/urls/administration.json';

const parseOrdering = str => {
  if (str && str.length) {
    if (str.endsWith(' desc')) {
      return {
        field: str.slice(0, str.length - 5),
        value: false,
      }
    } else {
      return {
        field: str,
        value: true,
      }
    }
  }

  return undefined;
}

const NEW_ROLE_TIME_LIVE = 2e4;
const state = () => ({
  loadings: {
    roles: true,
    permissionGroups: true,
  },

  roles: [],
  meta: {
    total: 0,
    count: 0,
  },

  permissionGroups: [],

  newRoles: [],
});

const getters = {
  routeQuery(_, __, rootState) {
    return rootState.route.query || {};
  },

  routeQueryNormalize(_, getters) {
    const routeQuery = getters.routeQuery;

    const queryNormalize = {
      role_name: routeQuery.role_name || '',
      ordering: parseOrdering(decodeURIComponent(routeQuery.ordering || '')),
    };

    return queryNormalize;
  },
}

const mutations = {
  setPermissionGroups(state, groups) {
    state.permissionGroups = groups || [];
  },

  /**
   * Обновление списка ролей
   * @param {Array} roles 
   */
  setRoles(state, roles) {
    state.roles = roles || [];
  },

  setMeta(state, meta) {
    state.meta = meta;
  },
  
  setLoadings(state, data) {
    if (typeof data !== 'object' || !data) return;
    
    for (let key in data) {
      state.loadings[key] = !!data[key];
    }
  },


  resetNewRoles(state) {
    state.newRoles = [];
  },

  addNewRolesInState(state, roles) {
    state.newRoles.push(...roles);
  },

  removeNewRolesFromState(state, roles) {
    state.newRoles = state.newRoles.filter(id => !roles.includes(id));
  }
}

const actions = {
  loadPermissionGroups({ commit }) {
    commit('setLoadings', { permissionGroups: true });

    return axios.get(adminURL.permissionGroups)
      .then(response => {
        commit('setPermissionGroups', [...response.data]);
        return response.data;
      })
      .finally(() => {
        commit('setLoadings', { permissionGroups: false });
      })
  },

  /**
   * Получение списка ролей
   */
  loadRoles({ commit }, params) {
    commit('setLoadings', { roles: true });
    
    return axios.get(adminURL.roles, { params })
      .then(response => {
        const data = response.data.map(role => {
          return {
            ...role,
            permissionIDs: role.permissions.map(({ id }) => id),
          };
        })
        commit('setRoles', [...data]);
        commit('setMeta', {
          total: data.length,
          count: data.length,
        });
        return data;
      })
      .finally(() => {
        commit('setLoadings', { roles: false });
      });
  },

  removeRoleAction(_, id) {
    const url = urlEditor(adminURL.specificRole, { id });
    return axios.delete(url);
  },

  /**
   * Запрос к бэкенду на создание роли
   * @param {Object} data данные для создания роли
   */
  addRoleAction(_, data) {
    return axios.post(adminURL.role, data)
      .then(response => response.data)
      .catch(error => {
        let result = null;
        if (error.response) {
          if (error.response.status === 409 && error.response.data.code === 'role_with_provided_title_exists') {
            // Конфликт с полем имени при создании новой роли
            result = {
              title: error.response.data.message,
            }
          } else if (error.response.status === 422) {
            // Конфликт с другими полями формы данных
            if (Array.isArray(error.response.data.detail)) {
              result = {};
              error.response.data.detail.forEach(detail => {
                if (detail.loc && detail.loc.length > 1 && detail.loc[0] === "body") {
                  const target = detail.loc[detail.loc.length - 1];
                  result[target] = detail.msg;
                }
              });
            }
          }
        }
        
        return Promise.reject(result);
      })
  },

  /**
   * Запрос к бэкенду на изменение роли
   * @param {Object} data данные для изменения роли
   */
  updateRoleAction(_, { id, data }) {
    const url = urlEditor(adminURL.specificRole, { id });

    return axios.put(url, data)
      .then(response => response.data)
      .catch(error => {
        let result = null;
        if (error.response) {
          if (error.response.status === 409 && error.response.data.code === 'role_with_provided_title_exists') {
            // Конфликт с полем имени при создании новой роли
            result = {
              title: error.response.data.message,
            }
          } else if (error.response.status === 422) {
            // Конфликт с другими полями формы данных
            if (Array.isArray(error.response.data.detail)) {
              result = {};
              error.response.data.detail.forEach(detail => {
                if (detail.loc && detail.loc.length > 1 && detail.loc[0] === "body") {
                  const target = detail.loc[detail.loc.length - 1];
                  result[target] = detail.msg;
                }
              });
            }
          }
        }
        
        return Promise.reject(result);
      });
  },

  addNewRoles({ commit }, ids) {
    const _ids = [...ids];
    commit('addNewRolesInState', _ids);
    setTimeout(() => {
      commit('removeNewRolesFromState', _ids);
    }, NEW_ROLE_TIME_LIVE);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};