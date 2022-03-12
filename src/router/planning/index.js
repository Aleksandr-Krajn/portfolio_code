const ProductionApplicationsPage = () => import(/* webpackChunkName: "ProductionApplicationsPage" */'@/modules/planning/pages/ProductionApplicationsPage');
const basePath = "/planning";

export default [
  {
    name: 'Planning',
    path: basePath,
    redirect: { name: 'ProductionApplications' },
  },
  {
    name: 'ProductionApplications',
    path: `${ basePath }/production-applications`,
    component: ProductionApplicationsPage,
    meta: {
    }
  }
];