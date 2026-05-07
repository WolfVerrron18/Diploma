import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { applyMoodTheme } from '@/data/ColorThemes.js'

export const useUserStore = defineStore('user', () => {
  const user = ref({})
  const defaultAvatar = 'https://i.ytimg.com/vi/q3XULScESEA/maxresdefault.jpg'

  // Геттер для получения данных пользователя
  const getUser = computed(() => user.value)

  /**
   * Динамический геттер для аватара.
   * Автоматически формирует URL на основе данных в сторе.
   */
  const userAvatar = computed(() => {
    const filename = user.value?.avatar

    if (!filename) return defaultAvatar

    // Если в базе лежит полная ссылка (например, на дефолтную картинку), возвращаем её
    if (filename.startsWith('http')) return filename

    // Формируем путь к нашему эндпоинту GridFS
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    return `${baseUrl}/api/users/avatar/${filename}`
  })

  const setUser = (data) => {
    user.value = data
  }

  // Следим за изменением объекта пользователя для смены темы
  watch(
    () => user.value?.mood,
    (newMood) => {
      applyMoodTheme(newMood || 'default')
    },
    { immediate: true }
  )

  return {
    user, // возвращаем сам ref для удобства (опционально)
    getUser,
    userAvatar, // твой новый вычисляемый URL
    setUser
  }
})
