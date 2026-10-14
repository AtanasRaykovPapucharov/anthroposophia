const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/pages/IndexPage.vue') },
      { path: 'ideas', name: 'ideas', component: () => import('@/pages/IdeasPage.vue') },
      { path: 'history', name: 'history', component: () => import('@/pages/HistoryPage.vue') },
      { path: 'fields', name: 'fields', component: () => import('@/pages/FieldsPage.vue') },
      { path: 'health', name: 'health', component: () => import('@/pages/HealthPage.vue') },
      { path: 'map', name: 'map', component: () => import('@/pages/MapPage.vue') },
      {
        path: 'festivals',
        name: 'festivals',
        component: () => import('@/pages/FestivalsPage.vue'),
      },
      { path: 'library', name: 'library', component: () => import('@/pages/LibraryPage.vue') },
      { path: 'about', name: 'about', component: () => import('@/pages/AboutPage.vue') },
    ],
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
