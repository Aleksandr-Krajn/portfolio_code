import Vue from 'vue'
import { authService }  from '@/services/auth.service'
import VueRouter from 'vue-router'

import Authorization from './authorization/authorization'
import Administration from './administration/administration'
import Planning from './planning';

import checkPermission from '@/assets/js/permissions';

Vue.use(VueRouter)

const routes = [
  ...Authorization,
  ...Administration,
  ...Planning,
  {
    path: '*',
    redirect: "/authorization"
  }
]


export default function generateRouter(store) {
  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  });

  router.beforeEach((to, _, next) => {
    const isGuest = authService.isGuest();

    if (isGuest) {
      // Если пользователь неавторизован, ему доступны только страницы без доступа к авторизации
      if (to.meta.requiresAuth) {
        next({ name: 'Authorization' });
        return;
      }
    } else {
      const _nextStepPermissions = () => {
        if (
          !to.meta.permissions ||
          to.meta.permissions.every(permission => checkPermission(permission, store))
        ) {
          next();
        } else {
          console.log("REDIRECT OT PAGE NOT FOUND OR FOR ALL USERS");
        }
      };

      const _nextStepUser = () => {
        if (to.name === 'Authorization') {
          next({ name: 'Administration' });
        } else {
          if (!store.state.Authorization.permissions || !store.state.Authorization.roles) {
            const promises = [];
            if (!store.state.Authorization.permissions) {
              promises.push(store.dispatch('Authorization/loadPermissions'));
            }
            if (!store.state.Authorization.roles) {
              promises.push(store.dispatch('Authorization/loadRoles'));
            }
            Promise.all(promises)
              .then(() => _nextStepPermissions())
              .catch(error => {
                // Если ошибка, вызываю уведомление
                window.bslNotice({ type: 'error', data: { message: error.toString() }});
                next(false);
              });

          } else {
            _nextStepPermissions();
          }
        }
      };
      
      /**
       * Если пользователь имеет ключ доступа,
       * то нужно проверить есть ли информаци о полльзователе в сторе,
       * иначе запросить ее
       */
      if (!store.state.Authorization.user) {
        store
          .dispatch('Authorization/loadCurrentUser')
          .then(() => {
            /**
             * После успешного получения данных о текущем пользователе
             * переходим к следующему шагу проверок.
             */
            _nextStepUser();
          })
          .catch(error => {
            if (error.response) {
              // Если ошибка вызвана неправильным ключем авторизации, мы стираем все неправильные данные
              if (error.response.status === '401') {
                authService.logout();
              }
            } else {
              // Если ошибка вызывана по другой причине, вызываю уведомление
              window.bslNotice({ type: 'error', data: { message: error.toString() }});
              next(false);
              return;
            }

            if (to.name !== "Authorization") {
              next({ name: 'Authorization' });
            } else {
              next();
            }
          });
      } else {
        /**
         * Если данные о пользователе уже есть,
         * то переходим к следующему шагу проверок.
         */
        _nextStepUser();
      }

      return;
    }

    next();
  });


  return router;
}