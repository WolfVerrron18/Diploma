import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref({})

  const getUser = computed(() => user.value)

  const setUser = (data) => {
    user.value = data
  }

  return {
    getUser,
    setUser
  }
})
