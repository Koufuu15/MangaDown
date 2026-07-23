import { createRouter, createWebHistory } from 'vue-router'
import parseUrl from '../views/parseUrl.vue'
import resMd from '../views/parseUrl.vue'
import writeMD from '../views/writeMD.vue'
import Home from '../views/Home.vue'
import guide from '../views/guide.vue'
import save from '../views/save.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      component: writeMD,
      props: {
        dataMd: resMd.value
      }
    },
    {
      path: '/guide',
      name: 'Guide',
      component: guide,
    },
    {
      path: '/save',
      name: 'Save',
      component: save
    }
  ]
})

export default router