<template>
  <!--  <component :is="defineLayout" />-->
  <RouterView v-slot="{ Component }">
    <component :is="Component" />
  </RouterView>
</template>

<script>
import { computed } from 'vue'

import { useRoute,useRouter } from 'vue-router'

import { ElLoading } from 'element-plus'

/** @module lodash - Утилиты */
import { isEmpty } from 'lodash'

import { ElNotification } from 'element-plus'

/** @module useUserStore - Глобальное хранилище пользователя */
import { useUserStore } from '@/stores/user.js'

/** @module UserService - Сервис для работы пользователем */
import UserService from '@/services/UserService.js'

/** @module MainLayout - Основной шаблон приложений */
import MainLayout from '@/layouts/MainLayout.vue'

import PageAuth from '@/components/pages/PageAuth.vue'

export default {
  name: 'App',

  components: { MainLayout, PageAuth },

  setup() {
    const route = useRoute()
    const router = useRouter()

    const userStore = useUserStore()

    const defineLayout = computed(() => {
      return isEmpty(userStore.getUser) ? 'PageAuth' : 'MainLayout'
    })

    const authUser = async () => {
      const token = localStorage.getItem('AccessToken')

      if (token) {
        const loading = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        try {
          const { data } = await UserService.user.getCurrentUser()

          userStore.setUser(data)
        }
        catch (e) {
          if (route.name !== 'auth') {
            ElNotification.error({
              title: 'error',
              message: 'Вы не авторизованы',
              showClose: true,
            })

            router.push({ name: 'auth' })
          }
        }
        finally {
          loading.close()
        }
      }

      if (!userStore.getUser) await router.push({ name: 'auth' })
    }

    authUser()

    return { defineLayout }
  }
}
</script>

<style scoped></style>
