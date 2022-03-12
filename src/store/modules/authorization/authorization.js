import axios from '@/services/axios';
import authURL from '@/assets/urls/authorization.json';
const isUndefinedDefault = (value, _default) => (value === undefined ? _default : value);
const normalizeUserInterfaceSettings = (settings) => {
  const _settings = (typeof settings === 'object' && !!settings) ? settings : {};
  const result = {
    sideBarOpened: isUndefinedDefault(_settings.sideBarOpened, true),
  }

  return result
}


const state = () => ({
  loadings: {
    roles: true,
  },
  
  user: null,
  permissions: null,
  roles: null,

  userInterfaceSettings: null
});

const mutations = {
  setCurrentUser(state, data) {
    state.user = data;
  },

  /**
   * Обновление списка пермишенов
   * @param {Array} permissions 
   */
  setPermissions(state, permissions) {
    state.permissions = permissions !== null ? permissions || [] : null;
  },

  /**
   * Обновление списка ролей системы
   * @param {Array} roles 
   */
  setRoles(state, roles) {
    state.roles = roles !== null ? roles || [] : null;
  },

  setUserInterfaceSettings(state, settings) {
    state.userInterfaceSettings = settings;
  },

  setLoadings(state, data) {
    if (typeof data !== 'object' || !data) return;
    
    for (let key in data) {
      state.loadings[key] = !!data[key];
    }
  },
}

const actions = {
  async loadCurrentUser({ commit, dispatch }) {
    return axios.get(authURL.currentUser)
      .then(response => {
        commit('setCurrentUser', { ...response.data });
        dispatch('loadUserInterfaceSettings');
        return response.data;
      });
  },

  async loadPermissions({ commit }) {
    return axios.get(authURL.permissions)
      .then(response => {
        commit('setPermissions', [...response.data]);
        return response.data;
      });
  },

  async loadRoles({ commit }) {
    commit('setLoadings', { roles: true });
    return axios.get(authURL.roles)
      .then(response => {
        const data = response.data.map(role => {
          return {
            ...role,
            permissionIDs: role.permissions.map(({ id }) => id),
          };
        })
        commit('setRoles', [...data]);
        commit('setLoadings', { roles: false });
        return data;
      });
  },

  loadUserInterfaceSettings({ commit, dispatch, getters }) {
    const key = getters.userInterfaceSettingsKey;
    let settings = {};
    commit('setUserInterfaceSettings', null);
    if (key) {
      const settingsStr = localStorage.getItem(key);
      if (settingsStr) {
        try {
          settings = JSON.parse(settingsStr);
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
    dispatch('updateUserInterfaceSettings', settings);
  },

  updateUserInterfaceSettings({ state, getters, commit }, data) {
    const key = getters.userInterfaceSettingsKey;
    const settings = normalizeUserInterfaceSettings({
      ...state.userInterfaceSettings,
      ...data
    });
    commit('setUserInterfaceSettings', settings);
    if (key) {
      try {
        localStorage.setItem(key, JSON.stringify(settings));
      } catch(e) {
        console.warn(e);
      }
    }
  },

  resetUser({ commit }) {
    commit('setCurrentUser', null);
    commit('setPermissions', null);
    commit('setRoles', null);
    commit('setUserInterfaceSettings', null);
  }
}

const getters = {
  userInterfaceSettingsKey(state) {
    return state.user ? `user_interface_settings_${ state.user.id }` : null;
  },

  isReadyUser(state) {
    return state.user && state.permissions && state.roles;
  },

  mapRoles(state) {
    const result = new Map();

    if (state.roles) {
      state.roles.forEach(role => {
        result.set(role.id, role);
      });
    }

    return result;
  },

  userRole(state, getters) {
    if (getters.isReadyUser && getters.mapRoles.has(state.user.role_id)) {
      return getters.mapRoles.get(state.user.role_id);
    }

    return null;
  },

  mapPermissions(state) {
    const result = new Map();

    if (state.permissions) {
      state.permissions.forEach(permission => {
        result.set(permission.name, permission);
      });
    }

    return result;
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}