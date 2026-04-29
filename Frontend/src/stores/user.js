import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { applyMoodTheme } from '@/data/ColorThemes.js'

export const useUserStore = defineStore('user', () => {
  const user = ref({})

  const getUser = computed(() => user.value)

  const setUser = (data) => {
    user.value = data
  }

  // Следим за изменением объекта пользователя
  watch(
    () => user.value,
    (newUser) => {
      if (newUser?.mood) {
        applyMoodTheme(newUser?.mood)
      } else {
        applyMoodTheme('default')
      }
    },
    { immediate: true } // Применится сразу при инициализации, если данные уже есть
  )

  return {
    getUser,
    setUser
  }
})
