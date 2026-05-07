<template>
  <div class="main-layout">
    <el-container>
      <el-header class="custom-header">
        <div class="header-left">
          <div class="logo">
            <el-icon :size="24" color="white"><Star /></el-icon>
            <span class="logo-text">Reflexing</span>
          </div>

          <el-breadcrumb separator="/" class="header-breadcrumb">
            <el-breadcrumb-item>Система</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <div class="theme-switch-wrapper">
            <el-switch
              v-model="isDark"
              inline-prompt
              :active-icon="Moon"
              :inactive-icon="Sunny"
              @change="toggleDark"
              class="custom-theme-switch"
            />
          </div>

          <div class="header-date">{{ currentDate }}</div>

          <el-divider direction="vertical" />

          <div class="user-profile">
            <span class="username">{{ getUserName }}</span>
            <el-dropdown trigger="click">
              <el-avatar :size="35" :src="store.userAvatar" class="avatar-hover" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :icon="Setting" @click="router.push('settings')"
                    >Настройки</el-dropdown-item
                  >
                  <el-dropdown-item :icon="Sort" @click="logout" divided>Выход</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <el-container style="height: calc(100vh - 60px)">
        <el-aside :width="isCollapse ? '64px' : '200px'" class="custom-aside">
          <el-menu
            :default-active="activeMenuIndex"
            class="el-menu-vertical"
            :collapse="isCollapse"
            @select="onPushRoute"
            text-color="rgba(255, 255, 255, 0.7)"
            active-text-color="#ffffff"
          >
            <el-menu-item v-for="(page, index) in pages" :key="index" :index="String(index)">
              <el-icon><component :is="page.icon" /></el-icon>
              <template #title>{{ page.title }}</template>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="custom-main">
          <RouterView v-slot="{ Component }">
            <Transition name="page-fade" mode="out-in">
              <component :is="Component" />
            </Transition>
          </RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import AuthService from '@/services/AuthService.js'
import UserService from '@/services/UserService.js'
import { useDark } from '@vueuse/core' // Нужна библиотека @vueuse/core
import {
  Star,
  Setting,
  Sort,
  Sunny,
  Moon,
  Tickets,
  PieChart,
  Histogram,
  Edit,
  Collection
} from '@element-plus/icons-vue'
const router = useRouter()
const route = useRoute()
const store = useUserStore()
const isCollapse = ref(false)

// 1. Инициализируем темную тему
const isDark = useDark({
  selector: 'html', // Явно указываем, куда вешать класс
  attribute: 'class',
  valueDark: 'dark',
  valueLight: ''
})

const pages = [
  {
    name: 'reflections', // Имя маршрута для заметок
    icon: Edit,
    title: 'Размышления'
  },
  {
    name: 'artifacts', // Имя маршрута для артефактов
    icon: Tickets,
    title: 'Артефакты'
  },
  {
    name: 'tags',
    icon: Collection,
    title: 'Теги'
  },
  {
    name: 'retro',
    icon: PieChart,
    title: 'Ретроспективы'
  },
  {
    name: 'graph',
    icon: Histogram,
    title: 'Аналитика'
  }
]

// --- Вычисляемые свойства ---
const getUserName = computed(
  () => `${store.getUser?.name} ${store.getUser?.surname ?? ''}` || 'Пользователь'
)

const activeMenuIndex = computed(() => {
  const index = pages.findIndex((p) => p.name === route.name)
  return index !== -1 ? String(index) : '0'
})

const currentPageTitle = computed(() => {
  const page = pages.find((p) => p.name === route.name)
  return page ? page.title : 'Настройки'
})

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long'
  }).format(new Date())
})

// --- Методы ---
// Метод сохранения настроек
const toggleDark = async (e) => {
  try {
    // Подготавливаем данные для бекенда
    const payload = { isDarkMode: isDark.value }

    // Вызываем твой метод сервиса
    // Предполагаем, что store.getUser._id — это текущий ID пользователя
    if (store.getUser?._id) {
      await UserService.user.update(store.getUser._id, payload)
    }
  } catch (error) {
    console.error('Ошибка при сохранении темы:', error)
    // В случае ошибки можно откатить тумблер назад, но для диплома это не критично
  }
}

const onPushRoute = async (index) => {
  const foundPage = pages[Number(index)]
  if (foundPage) {
    await router.push({ name: foundPage.name })
  }
}

const logout = async () => {
  try {
    await AuthService.auth.logout()

    // Сброс темы и стилей
    isDark.value = false
    document.documentElement.removeAttribute('style')

    localStorage.clear()
    store.setUser({})

    await router.push({ name: 'auth' })
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  }
}

// 3. Синхронизация при загрузке:
// Когда данные пользователя прилетают из getCurrentUser, подтягиваем тему в переключатель
watch(
  () => store.getUser?.isDarkMode,
  (newVal) => {
    if (newVal !== undefined) {
      isDark.value = newVal
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (route.path === '/') {
    onPushRoute('0')
  }
})
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
  overflow: hidden;

  .custom-header {
    background-color: var(
      --el-color-primary
    ); // Теперь она будет зависеть от выбранного настроения    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    height: 60px;
    transition: background 0.3s ease; // Плавная смена фона если решите менять градиент

    .header-left,
    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .theme-switch-wrapper {
      display: flex;
      align-items: center;

      // Стилизация переключателя под ваш скриншот
      :deep(.custom-theme-switch) {
        --el-switch-on-color: #2c3e50;
        --el-switch-off-color: rgba(255, 255, 255, 0.3);

        .el-icon {
          color: #f1c40f; // Цвет солнца/луны
        }
      }
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      .logo-text {
        font-weight: 700;
        font-size: 1.1rem;
        letter-spacing: 0.5px;
      }
    }

    .header-breadcrumb {
      margin-left: 20px;
      :deep(.el-breadcrumb__inner) {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
        color: white !important;
      }
    }

    .header-date {
      font-size: 0.85rem;
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 12px;
      border-radius: 20px;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 12px;

      .username {
        font-size: 0.95rem;
        font-weight: 500;
      }
      .avatar-hover {
        border: 2px solid rgba(255, 255, 255, 0.3);
        transition: 0.3s;
        cursor: pointer;
        &:hover {
          transform: scale(1.05);
          border-color: white;
        }
      }
    }
  }

  .custom-aside {
    transition: all 0.3s;
    // Используем основной цвет, но накладываем сильное затемнение (80%)
    background-color: color-mix(in srgb, var(--el-color-primary), #000 80%) !important;
    border-right: 1px solid rgba(0, 0, 0, 0.2);

    .el-menu {
      background-color: transparent !important;
      border-right: none;

      // Текст делаем приглушенным белым
      --el-menu-text-color: rgba(255, 255, 255, 0.6);
      --el-menu-hover-bg-color: rgba(255, 255, 255, 0.05);
    }
  }

  // Активный пункт меню выделяем цветом темы
  :deep(.el-menu-item.is-active) {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: var(--el-color-primary) !important; // Иконка и текст светятся цветом темы
  }

  .custom-main {
    background-color: var(--el-bg-color-page); // Автоматическая смена фона для Element Plus
    transition: background-color 0.3s;
    padding: 0;
  }

  .page-fade-enter-active,
  .page-fade-leave-active {
    transition:
      opacity 0.3s,
      transform 0.3s;
  }
  .page-fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .page-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

:deep(.el-divider--vertical) {
  border-left: 1px solid rgba(255, 255, 255, 0.3);
}

// Глобальные корректировки для темной темы внутри лэйаута
:deep(html.dark) {
  .custom-header {
    background: linear-gradient(90deg, #1d1e1f 0%, #2c3e50 100%);
  }
}
</style>
