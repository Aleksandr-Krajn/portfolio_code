import axios from '@/services/axios'
import cookie from 'vue-cookies'
import queryString from 'query-string'

import authURL from '@/assets/urls/authorization.json';

const ACCESS_TOKEN_NAME = 'access_token';

export const authService = {
    login,
    logout,
    isGuest
};

function isGuest() {
    const token = cookie.get(ACCESS_TOKEN_NAME);
    return !token;
}

function login(username, password) {
    const params = {
        username,
        password 
    }

    return axios(authURL.login, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: queryString.stringify(params),
    })
        .then(data => {
            const access_token = data.data.access_token
            
            if(access_token){
                cookie.set(ACCESS_TOKEN_NAME, access_token, Infinity)
                return true;
            }
        });
}

function logout() {
    localStorage.removeItem('user');
    cookie.remove(ACCESS_TOKEN_NAME);
}

export default authService;