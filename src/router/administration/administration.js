const RightsPage = () => import(/* webpackChunkName: "RightsPage" */'@/modules/administration/pages/RightsPage');
const UsersPage = () => import(/* webpackChunkName: "UsersPage" */'@/modules/administration/pages/UsersPage');

// import WorkshopConstructorPage from '@/modules/administration/pages/WorkshopConstructorPage/index.vue';
// import ReportTemplatesPage from '@/modules/administration/pages/ReportTemplatesPage/index.vue';
// import History from '@/modules/administration/pages/HistoryPage/index.vue';

import i18n from '@/plugins/i18n';
import permissions from '@/assets/constants/permissions';

const basePath = '/administration';
export default [
  {
    name: 'Administration',
    path: basePath,
    redirect: { name: 'Users' },
  },
  // Права пользователей
  {
    name: 'Rights',
    path: `${ basePath }/rights`,
    component: RightsPage,
    meta: {
      name: i18n.t('message.admin.rights.namePage'),
      requiresAuth: true,
      permissions: [permissions.ACCESS_RIGHTS_MANAGEMENT],
    }
  },
  // Пользователи
  {
    name: 'Users',
    path: `${ basePath }/users`,
    component: UsersPage,
    meta: {
      name: i18n.t('message.admin.users.namePage'),
      requiresAuth: true,
      permissions: [permissions.USER_MANAGEMENT],
    }
  },
  // {
  //   name: 'workshop-constructor',
  //   path: '/administration/workshop-constructor',
  //   component: WorkshopConstructorPage,
  //   meta: {
  //     name: i18n.t('message.common.pages.workshopConstructor'),
  //     requiresAuth: true
  //   }
  // },
  // {
  //   name: 'report-templates',
  //   path: '/administration/report-templates',
  //   component: ReportTemplatesPage,
  //   meta: {
  //     name: i18n.t('message.common.pages.reportTemplates'),
  //     requiresAuth: true
  //   }
  // },
  // {
  //   name: 'history',
  //   path: '/administration/history',
  //   component: History,
  //   meta: {
  //     name: i18n.t('message.common.pages.history'),
  //     requiresAuth: true
  //   }
  // }
]