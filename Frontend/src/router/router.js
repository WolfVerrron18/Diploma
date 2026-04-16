import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import PageAuth from '@/components/pages/PageAuth.vue'
import PagePurposes from '@/components/pages/PagePurposes.vue'
import PageBankAccounts from '@/components/pages/PageBankAccounts.vue'
import PageCategories from '@/components/pages/PageCategories.vue'
import PageTransactions from '@/components/pages/PageTransactions.vue'
import PageTODOList from '@/components/pages/PageTODOList.vue'
import PageStatistics from '@/components/pages/PageStatistics.vue'
import PageSettings from '@/components/pages/PageSettings.vue'

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
        },
        {
          path: '/transactions',
          name: 'transactions',
          component: PageTransactions,
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
