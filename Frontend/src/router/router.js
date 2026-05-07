import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import PageAuth from '@/components/pages/PageAuth.vue'
import PageSettings from '@/components/pages/PageSettings.vue'
import PageReflections from '@/components/pages/PageReflections.vue'
import PageArtifacts from '@/components/pages/PageArtifacts.vue'
import PageTags from '@/components/pages/PageTags.vue'
import PageRetrospectives from '@/components/pages/PageRetrospectives.vue'
import PageGraph from '@/components/pages/PageGraph.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: MainLayout,
      meta: { private: true },
      children: [
        {
          path: '/reflections',
          name: 'reflections',
          component: PageReflections,
          meta: { private: true }
        },
        {
          path: '/artifacts',
          name: 'artifacts',
          component: PageArtifacts,
          meta: { private: true }
        },
        {
          path: '/tags',
          name: 'tags',
          component: PageTags,
          meta: { private: true }
        },
        {
          path: '/retro',
          name: 'retro',
          component: PageRetrospectives,
          meta: { private: true }
        },
        {
          path: '/graph',
          name: 'graph',
          component: PageGraph,
          meta: { private: true }
        },
        {
          path: '/settings',
          name: 'settings',
          component: PageSettings,
          meta: { private: true }
        }
      ]
    },
    {
      path: '/auth',
      name: 'auth',
      component: PageAuth
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   // const store = useUserStore()
//   //&& !isEmpty(store.getUser)
//   const isAuth = localStorage.getItem('AccessToken')
//
//   if (to.matched.some((route) => route.meta?.private) && !isAuth) {
//     router.push({ name: 'auth' })
//   }
//
//   next()
// })

export default router
