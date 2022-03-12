import { axios, urlEditor } from '@/services/axios';

import adminURL from '@/assets/urls/administration.json';

const parseIntegerNumbers = str => {
  const value = +str;
  const isInteger = Number.isInteger(value);
  
  return (str.length && isInteger)
    ? value
    : undefined;
};

const parseBoolean = str => {
  const isBoolean = ['true', 'false'].includes(str);

  return (str.length && isBoolean)
    ? str === 'true'
    : undefined;
};

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

const orderingToString = ordering => {
  let value = "";
  
  if (ordering) {
    value += ordering.field;

    if (!ordering.value) {
      value += " desc";
    }
  } 

  return value;
};

const DEFAULT_SIZE_USERS_PER_PAGE = 50;
const NEW_USER_TIME_LIVE = 2e4;

const state = () => ({
  loadings: {
    users: true,
  },

  users: [],
  meta: {
    total: 0,
    currentPage: 1,
    count: 1,
    pageSize: DEFAULT_SIZE_USERS_PER_PAGE,
  },

  newUsers: [],
});

const getters = {
  routeQuery(_, __, rootState) {
    return rootState.route.query || {};
  },

  routeQueryNormalize(_, getters) {
    const routeQuery = getters.routeQuery;

    const queryNormalize = {
      id: parseIntegerNumbers(routeQuery.id || ''),
      role_id: parseIntegerNumbers(routeQuery.role_id || ''),
      is_active: parseBoolean(routeQuery.is_active || ''),
      from_ad: parseBoolean(routeQuery.from_ad || ''),
      full_name: decodeURIComponent(routeQuery.full_name || ''),
      login: decodeURIComponent(routeQuery.login || ''),
      date_from: routeQuery.date_from || '',
      date_to: routeQuery.date_to || '',
      page: parseIntegerNumbers(routeQuery.page || '') || 1,
      size: parseIntegerNumbers(routeQuery.size || '') || DEFAULT_SIZE_USERS_PER_PAGE,
      ordering: parseOrdering(decodeURIComponent(routeQuery.ordering || '')),
    };

    return queryNormalize;
  },

  sendUsersParams(_, getters) {
    const routeQueryNormalize = getters.routeQueryNormalize;

    return {
      page: routeQueryNormalize.page,
      size: routeQueryNormalize.size,
      id: routeQueryNormalize.id,
      role_id: routeQueryNormalize.role_id,
      is_active: routeQueryNormalize.is_active,
      from_ad: routeQueryNormalize.from_ad,
      full_name: routeQueryNormalize.full_name || undefined,
      login: routeQueryNormalize.login || undefined,
      date_from: routeQueryNormalize.date_from || undefined,
      date_to: routeQueryNormalize.date_to || undefined,
      ordering: orderingToString(routeQueryNormalize.ordering) || undefined,
    }
  }
};

const mutations = {
  /**
   * Обновление списка ролей
   * @param {Array} roles 
   */
  setUsers(state, users) {
    state.users = users || [];
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


  resetNewUsers(state) {
    state.newUsers = [];
  },

  addNewUsersInState(state, users) {
    state.newUsers.push(...users);
  },

  removeNewUsersFromState(state, users) {
    state.newUsers = state.newUsers.filter(id => !users.includes(id));
  }
}

const actions = {
  loadUsers({ commit }, params) {
    commit('setLoadings', { users: true });

    return axios.get(adminURL.users, { params })
      .then(response => {
        commit('setUsers', [...response.data.items]);
        commit('setMeta', {
          total: response.data.total,
          page: response.data.page,
          count: response.data.items.length,
          pageSize: response.data.size,
        });
        
        return response.data.items;
      })
      .finally(() => {
        commit('setLoadings', { users: false });
      });
  },

  async addUserAction(_, data) {
    return axios.post(adminURL.user, data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        let result = null;
        if (error.response) {
          if (error.response.status === 409 && error.response.data.code === "user_with_provided_login_exists") {
            // Конфликт с полем логина при создании нового пользователя
            result = {
              login: error.response.data.message,
            }
          } else if (error.response.status === 422) {
            if (Array.isArray(error.response.data.detail)) {
              result = {};
              error.response.data.detail.forEach(detail => {
                if (detail.loc && detail.loc.length > 1 && detail.loc[0] === "body") {
                  const target = detail.loc[detail.loc.length - 1];
                  result[target] = detail.msg;
                }
              });
            }
            // Конфликт с другими полями формы данных
          }
        }
        
        return Promise.reject(result);
      });
  },

  async updateUserAction(_, { id, data }) {
    const url = urlEditor(adminURL.specificUser, { id });

    return axios.put(url, data)
      .then(response => response.data)
      .catch(error => {
        let result = null;
        if (error.response) {
          if (error.response.status === 422) {
            if (Array.isArray(error.response.data.detail)) {
              result = {};
              error.response.data.detail.forEach(detail => {
                if (detail.loc && detail.loc.length > 1 && detail.loc[0] === "body") {
                  const target = detail.loc[detail.loc.length - 1];
                  result[target] = detail.msg;
                }
              });
            }
            // Конфликт с другими полями формы данных
          }
        }
        
        return Promise.reject(result);
      });
  },

  async resetUserPasswordAction(_, id) {
    const url = urlEditor(adminURL.userPassword, { id });
    
    return axios.get(url)
      .then(response => response.data);
  },


  addNewUsers({ commit }, ids) {
    const _ids = [...ids];
    commit('addNewUsersInState', _ids);
    setTimeout(() => {
      commit('removeNewUsersFromState', _ids);
    }, NEW_USER_TIME_LIVE);
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}