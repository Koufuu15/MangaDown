import { createRouter, createWebHistory } from 'vue-router'
import parseUrl from '../components/parseUrl.vue'
import writeMD from '../components/writeMD.vue'
import Home from '../components/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/parse-url',
      name: 'ParseUrl',
      component: parseUrl
    },
    {
      path: '/write-md',
      name: 'WriteMD',
      component: writeMD
    }
  ]
})

export default router