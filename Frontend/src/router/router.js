import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import PageAuth from '@/components/pages/PageAuth.vue'
import PagePurposes from '@/components/pages/PagePurposes.vue'
import PageBankAccounts from '@/components/pages/PageBankAccounts.vue'
import PageCategories from "@/components/pages/PageCategories.vue";

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

router.beforeEach((to, from, next) => {
  // const store = useUserStore()
  //&& !isEmpty(store.getUser)
  const isAuth = localStorage.getItem('AccessToken')

  if (to.matched.some((route) => route.meta?.private) && !isAuth) {
    router.push({ name: 'auth' })
  }

  next()
})

export default router
