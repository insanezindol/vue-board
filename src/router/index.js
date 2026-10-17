import { createRouter, createWebHashHistory } from 'vue-router'
import Read from '@/components/Read.vue'
import Create from '@/components/Create.vue'
import Detail from '@/components/Detail.vue'

export default createRouter({
  // vue-router 3의 기본값(hash 모드)과 동일한 URL(/#/...)을 유지
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'Read',
      component: Read
    },
    {
      path: '/create/:contentId?',
      name: 'Create',
      component: Create
    },
    {
      path: '/detail/:contentId',
      name: 'Detail',
      component: Detail
    }
  ]
})
