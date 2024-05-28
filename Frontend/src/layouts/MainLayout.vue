<template>
  <div class="main-layout">
    <el-container>
      <el-header>
        <el-avatar> {{ getUserName }} </el-avatar>

        <el-button @click="logout">Выход</el-button>
      </el-header>
      <el-container style="height: calc(100vh - 100px)" default-active="0" :collapse="isCollapse">
        <el-aside width="200px">
          <el-menu
            default-active="0"
            style="height: 100%"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @select="onPushRoute"
          >
            <el-menu-item v-for="(page, index) in pages" :key="index" :index="String(index)">
              <el-icon><component :is="page.icon" /></el-icon>

              <template #title> {{ page.title }} </template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <RouterView v-slot="{ Component }">
            <Transition name="dropdown" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user.js'
import AuthService from '@/services/AuthService.js'
import { computed, onMounted, ref } from 'vue'
import { Collection, PieChart, Setting, Sort, Star, Tickets } from '@element-plus/icons-vue'

export default {
  name: 'MainLayout',
  components: { Sort, Collection, Tickets, PieChart, Star, Setting },

  setup() {
    const router = useRouter()

    const store = useUserStore()

    const isCollapse = ref(false)

    const getUserName = computed(() => {
      return store.getUser.name
    })

    const pages = [
      {
        name: 'bankAccounts',
        icon: 'Tickets',
        title: 'Счета'
      },
      {
        name: 'categories',
        icon: 'Collection',
        title: 'Категории'
      },
      {
        name: 'transactions',
        icon: 'Sort',
        title: 'Транзакции'
      }
    ]

    const onPushRoute = async (index) => {
      const foundPage = pages[Number(index)]

      await router.push({ name: foundPage.name })
    }

    const logout = async () => {
      await AuthService.auth.logout()

      localStorage.clear()

      await router.push({ name: 'auth' })
    }

    onMounted(() => onPushRoute('0'))

    return { pages, isCollapse, getUserName, logout, onPushRoute }
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;

  & .el-header {
    background-color: var(--el-color-primary-light-3);
    color: var(--el-text-color-primary);
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
