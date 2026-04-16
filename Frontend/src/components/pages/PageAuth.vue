<template>
  <div class="page-auth">
    <Transition name="dropdown" mode="out-in">
      <AuthWrapper
        class="page-auth__wrapper"
        :title="defineActiveViewAuth.title"
        :key="defineActiveViewAuth.id"
      >
        <component
          :is="defineActiveViewAuth.id"
          :loading-submit-button="loadingSubmitButton"
          @on-form-submitted="authUser"
        />

        <div class="page-auth__wrapper-controls">
          <el-text>{{ defineActiveViewAuth.text }}</el-text>
          <el-button type="primary" link @click="changeAuthentication">
            {{ defineActiveViewAuth.button }}
          </el-button>
        </div>
      </AuthWrapper>
    </Transition>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

import { useRouter } from 'vue-router'

/** @module lodash - Утилиты */
import forEach from 'lodash/forEach'

/** @module useUserStore - Глобальное хранилище пользователя */
import { useUserStore } from '@/stores/user.js'

/** @module AuthService - Сервис аутентификации пользователя */
import AuthService from '@/services/AuthService.js'

/** @module UserService - Сервис для работы пользователем */
import UserService from '@/services/UserService.js'

/** @module Components - Компоненты */
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import AuthWrapper from '@/components/auth/AuthWrapper.vue'

export default {
  name: 'PageAuth',

  components: { AuthWrapper, LoginForm, RegisterForm },

  setup() {
    const router = useRouter()

    const userStore = useUserStore()

    const loadingSubmitButton = ref(false)

    const activeViewAuth = ref('LoginForm')

    const viewAuth = [
      {
        title: 'Вход',
        id: 'LoginForm',
        text: 'У вас нет аккаунта?',
        button: 'Зарегистрироваться'
      },
      {
        title: 'Регистрация',
        id: 'RegisterForm',
        text: 'У вас уже есть аккаунт?',
        button: 'Войти'
      }
    ]

    /** @function
     * @name defineActiveViewAuth - Определение активного представления аутентификации пользователя */
    const defineActiveViewAuth = computed(() => {
      return viewAuth.find((auth) => auth.id === activeViewAuth.value)
    })

    const changeAuthentication = () => {
      const methods = {
        RegisterForm: 'LoginForm',
        LoginForm: 'RegisterForm'
      }

      activeViewAuth.value = methods[activeViewAuth.value]
    }

    /** @function
     * @name authUser - Аутентификация пользователя */
    const authUser = async (formData, authType) => {
      const strategy = {
        login: AuthService.auth.login,
        register: AuthService.auth.register
      }

      loadingSubmitButton.value = true

      try {
        const { data } = await strategy[authType](formData)

        forEach(data, (value, key) => localStorage.setItem(key, value))

        const { data: user } = await UserService.user.getCurrentUser()

        userStore.setUser(user)

        await router.push({ name: 'main' })
      } catch (e) {
        loadingSubmitButton.value = false
      } finally {
        loadingSubmitButton.value = false
      }
    }

    return {
      activeViewAuth,
      viewAuth,
      loadingSubmitButton,
      defineActiveViewAuth,
      authUser,
      changeAuthentication
    }
  }
}
</script>

<style scoped lang="scss">
.page-auth {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__wrapper-controls {
    display: flex;
    gap: 5px;
    justify-content: center;
  }
}
</style>
