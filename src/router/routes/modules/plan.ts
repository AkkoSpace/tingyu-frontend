import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const FORM: AppRouteRecordRaw = {
  path: '/plan',
  name: 'plan',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.plan',
    icon: 'icon-calendar-clock',
    requiresAuth: true,
    order: 3,
  },
  children: [
    {
      path: 'main',
      name: 'Main',
      component: () => import('@/views/plan/main/index.vue'),
      meta: {
        locale: 'menu.plan.main',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default FORM;
