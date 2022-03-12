const AuthorizationPage = () => import(/* webpackChunkName: "AuthorizationPage" */'@/modules/authorization/pages/AuthorizationPage');

export default [
  {
    name: 'Authorization',
    path: '/authorization',
    component: AuthorizationPage,
    meta: {
      layout: 'authorization',
      requiresAuth: false
    }
  }
]