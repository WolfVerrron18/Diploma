import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import PageAuth from '@/components/pages/PageAuth.vue'
import PagePurposes from '@/components/pages/PagePurposes.vue'
import PageBankAccounts from '@/components/pages/PageBankAccounts.vue'
import PageCategories from '@/components/pages/PageCategories.vue'
import PageTODOList from '@/components/pages/PageTODOList.vue'
import PageStatistics from '@/components/pages/PageStatistics.vue'
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
          path: '/notes',
          name: 'notes',
          component: PageTODOList,
          meta: { private: true }
        },
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
          path: '/statistics',
          name: 'statistics',
          component: PageStatistics,
          meta: { private: true }
        },
        {
          path: '/settings',
          name: 'settings',
          component: PageSettings,
          meta: { private: true }
        },

        {
          path: '/purpose',
          name: 'purpose',
          component: PagePurposes,
          meta: { private: true }
        },
        {
          path: '/bank-accounts',
          name: 'bankAccounts',
          component: PageBankAccounts,
          meta: { private: true }
        },
        {
          path: '/categories',
          name: 'categories',
          component: PageCategories,
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
