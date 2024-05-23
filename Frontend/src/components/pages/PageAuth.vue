<template>
  <div class="auth">
    <div class="auth__card">
      <el-radio-group v-model="activeViewAuth" size="small" class="auth__select-group">
        <el-radio-button
          v-for="(view, index) in viewAuth"
          :key="index"
          :label="view.label"
          :value="view.value"
        />
      </el-radio-group>

      <component
        :is="activeViewAuth"
        :loading-submit-button="loadingSubmitButton"
        @on-form-submitted="authUser"
      />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

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

export default {
  name: 'PageAuth',

  components: { LoginForm, RegisterForm },

  setup() {
    const router = useRouter()

    const userStore = useUserStore()

    const loadingSubmitButton = ref(false)

    const activeViewAuth = ref('LoginForm')

    const viewAuth = [
      {
        label: 'Вход',
        value: 'LoginForm'
      },
      {
        label: 'Регистрация',
        value: 'RegisterForm'
      }
    ]

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
      } finally {
        loadingSubmitButton.value = true
      }
    }

    return { activeViewAuth, viewAuth, loadingSubmitButton, authUser }
  }
}
</script>

<style scoped lang="scss">
.auth {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__card {
    max-width: 300px;
    height: fit-content;
    background: white;
    padding: 10px;
    border: 1px solid var(--el-menu-border-color);
    border-radius: var(--main-border-radius);
  }

  &__select-group {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
}
</style>
