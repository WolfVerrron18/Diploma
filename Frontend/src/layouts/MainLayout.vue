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
            default-active="2"
            style="height: 100%"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="
              (R) => {
                console.log(R)
              }
            "
            @close="handleClose"
          >
            <!--            <RouterLink to="/purpose">-->
            <!--              <el-menu-item index="0">-->
            <!--                <el-icon><Star /></el-icon>-->
            <!--                <template #title> Цели </template>-->
            <!--              </el-menu-item>-->
            <!--            </RouterLink>-->

            <RouterLink to="/bank-accounts">
              <el-menu-item index="1">
                <el-icon><Tickets /></el-icon>

                <template #title> Счета </template>
              </el-menu-item>
            </RouterLink>

            <RouterLink to="/categories">
              <el-menu-item index="2">
                <el-icon><Collection /></el-icon>

                <template #title> Категории </template>
              </el-menu-item>
            </RouterLink>

            <RouterLink to="/transactions">
              <el-menu-item index="3">
                <el-icon><Sort /></el-icon>
                <template #title> Транзакции </template>
              </el-menu-item>
            </RouterLink>
          </el-menu>
        </el-aside>
        <el-main>
          <RouterView v-slot="{ Component }">
            <component :is="Component" />
          </RouterView>
        </el-main>
      </el-container>
    </el-container>

    <!--    TODO ME-->
    <!--        <RouterView v-slot="{ Component }">-->
    <!--          <component :is="Component" />-->
    <!--        </RouterView>-->

    <!--    <PageAuth />-->
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

import { useUserStore } from '@/stores/user.js'
import AuthService from '@/services/AuthService.js'
import { computed, ref } from 'vue'
import PurposeService from '@/components/purposes/service/PurposeService.js'
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

    const logout = async () => {
      await AuthService.auth.logout()

      localStorage.clear()

      await router.push({ name: 'auth' })
    }

    const getPurpose = async () => {
      const { data } = await PurposeService.purposes.get('664147be64016c68abf1236c')
      console.log(data)
    }
    getPurpose()

    return { isCollapse, getUserName, logout }
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
