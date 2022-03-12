import axios from 'axios';
import cookie from 'vue-cookies'

import authURL from '@/assets/urls/authorization.json';

const instance = axios.create({
  baseURL: `${ process.env.VUE_APP_SERVER_ADDRESS }/admin/api/v${ process.env.VUE_APP_VERSION_API }`,
  headers: {},
});

/**
 * Прослойка перед запросом на сервер
 */
instance.interceptors.request.use((request) => {
  if (request.url !== authURL.login && request.url.startsWith('/')) {
    const token = cookie.get('access_token');
    
    if (token) {
      request.headers.common['Authorization'] = `Bearer ${ token }`;
    }
  }

  return request;
});


/**
 * Редактор url
 * 
 * @param {String} str Строка запроса
 * @param {Object} params Параметры, вставляемые в строку запроса
 * @returns {String} Итоговый url
 * 
 * @example
 * // returns "/users/999/save/done"
 * urlEditor("/users/:id/:action/done", { id: 999, action: "save" });
 */
const urlEditor = function (str, params) {
  let result = str;
  for (const param in params) {
    result = result.replace(`:${ param }`, params[param]);
  }
  return result;
};

export {
  instance as axios,
  urlEditor
};

export default instance;