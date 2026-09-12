import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '工作台' }
  },
  {
    path: '/customer',
    name: 'Customer',
    component: () => import('@/views/customer/index.vue'),
    meta: { title: '客户管理' }
  },
  {
    path: '/clue',
    name: 'Clue',
    component: () => import('@/views/clue/index.vue'),
    meta: { title: '线索管理' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/contact/index.vue'),
    meta: { title: '联系人管理' }
  },
  {
    path: '/business',
    name: 'Business',
    component: () => import('@/views/business/index.vue'),
    meta: { title: '商机管理' }
  },
  {
    path: '/contract',
    name: 'Contract',
    component: () => import('@/views/contract/index.vue'),
    meta: { title: '合同管理' }
  },
  {
    path: '/receivable',
    name: 'Receivable',
    component: () => import('@/views/receivable/index.vue'),
    meta: { title: '回款管理' }
  },
  {
    path: '/followup',
    name: 'Followup',
    component: () => import('@/views/followup/index.vue'),
    meta: { title: '跟进记录' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
