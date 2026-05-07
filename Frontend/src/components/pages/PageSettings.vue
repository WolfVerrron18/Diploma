<template>
  <div class="page-profile">
    <!-- Контейнер для GSAP анимации -->
    <div class="lava-container">
      <div class="lava-blob lava-1" ref="blob1"></div>
      <div class="lava-blob lava-2" ref="blob2"></div>
      <div class="lava-blob lava-3" ref="blob3"></div>
    </div>

    <header class="profile-header stage-0">
      <h1 class="page-title">Настройки профиля</h1>
      <p class="page-subtitle">Персонализируйте ваш аккаунт</p>
    </header>

    <div class="profile-container" v-loading="loading">
      <el-row :gutter="24" v-if="!loading" class="profile-row">
        <el-col :xs="24" :sm="9" :md="8" class="col-avatar">
          <el-card
            class="avatar-card glass-card stage-1"
            shadow="never"
            @mousemove="handleMagnetic"
            @mouseleave="resetMagnetic"
            ref="avatarCardRef"
          >
            <div class="avatar-section">
              <div class="avatar-ring">
                <el-upload
                  class="avatar-picker"
                  action="#"
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleAvatarChange"
                  accept="image/*"
                >
                  <div class="avatar-wrapper" v-loading="isAvatarLoading">
                    <el-avatar
                      :size="140"
                      :src="store.userAvatar"
                      class="current-avatar"
                      @load="onAvatarLoad"
                    />
                    <div class="upload-overlay">
                      <el-icon class="camera-icon"><Camera /></el-icon>
                      <span>Заменить</span>
                    </div>
                  </div>
                </el-upload>
              </div>

              <div class="user-info">
                <h2 class="display-name">{{ userForm.name || 'Имя' }}</h2>
                <p class="display-surname">{{ userForm.surname || 'Фамилия' }}</p>
                <el-tag size="small" round effect="light">Пользователь</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="15" :md="16" class="col-form">
          <el-card class="form-card glass-card stage-2" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon class="header-icon"><User /></el-icon>
                <h3>Личные данные</h3>
              </div>
            </template>

            <el-form
              :model="userForm"
              label-position="top"
              ref="profileFormRef"
              :rules="rules"
              @submit.prevent
            >
              <el-row :gutter="20">
                <el-col :sm="12" :xs="24" class="form-item-anim">
                  <el-form-item label="Имя" prop="name">
                    <el-input v-model="userForm.name" placeholder="Олег" />
                  </el-form-item>
                </el-col>
                <el-col :sm="12" :xs="24" class="form-item-anim">
                  <el-form-item label="Фамилия" prop="surname">
                    <el-input v-model="userForm.surname" placeholder="Олегов" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="Логин (ID)" prop="login" class="form-item-anim">
                <el-input v-model="userForm.login" disabled>
                  <template #prefix
                    ><el-icon><Lock /></el-icon
                  ></template>
                </el-input>
              </el-form-item>

              <div class="form-actions form-item-anim">
                <el-button type="primary" :loading="saving" class="save-btn" @click="saveProfile">
                  <el-icon v-if="!saving" style="margin-right: 8px"><Check /></el-icon>
                  Сохранить изменения
                </el-button>
              </div>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera, User, Lock, Check } from '@element-plus/icons-vue'
import UserService from '@/services/UserService.js'
import { useUserStore } from '@/stores/user.js'
import { gsap } from 'gsap'

const store = useUserStore()
const profileFormRef = ref(null)
const avatarCardRef = ref(null)
const blob1 = ref(null)
const blob2 = ref(null)
const blob3 = ref(null)

const loading = ref(true)
const saving = ref(false)
const isAvatarLoading = ref(false)
const userId = ref(null)
const isAnimated = ref(false)

const userForm = reactive({
  name: '',
  surname: '',
  login: '',
  avatar: ''
})

const rules = {
  name: [{ required: true, message: 'Обязательно', trigger: 'blur' }],
  surname: [{ required: true, message: 'Обязательно', trigger: 'blur' }]
}

// Утилита для получения случайного числа
const random = (min, max) => Math.random() * (max - min) + min

// Анимация "блуждания" для лава-блобов
const moveBlob = (el) => {
  if (!el) return
  gsap.to(el, {
    x: random(-150, 150),
    y: random(-150, 150),
    scale: random(0.8, 1.5),
    duration: random(4, 8),
    ease: 'sine.inOut',
    onComplete: () => moveBlob(el)
  })
}

const onAvatarLoad = () => {
  isAvatarLoading.value = false
}

const animateEntry = () => {
  if (isAnimated.value) return
  isAnimated.value = true

  const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 0.9 } })
  tl.from('.stage-0', { y: 20, opacity: 0 })
    .from('.stage-1', { y: 30, opacity: 0 }, '-=0.6')
    .from('.stage-2', { y: 30, opacity: 0 }, '-=0.7')
    .from('.form-item-anim', { y: 15, opacity: 0, stagger: 0.08 }, '-=0.6')

  // Запуск фоновой анимации
  moveBlob(blob1.value)
  moveBlob(blob2.value)
  moveBlob(blob3.value)
}

const handleAvatarChange = async (file) => {
  if (!file.raw.type.startsWith('image/')) return ElMessage.error('Нужна картинка')
  try {
    isAvatarLoading.value = true
    const formData = new FormData()
    formData.append('avatar', file.raw)
    const { data } = await UserService.user.updateAvatar(userId.value, formData)
    store.setUser(data)
    syncFormWithData(data)
    gsap.fromTo(
      '.current-avatar',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4 }
    )
    ElMessage.success('Аватар обновлен')
  } catch (e) {
    ElMessage.error('Ошибка загрузки')
  } finally {
    isAvatarLoading.value = false
  }
}

const saveProfile = async () => {
  if (!profileFormRef.value) return
  try {
    await profileFormRef.value.validate()
    saving.value = true
    const { data } = await UserService.user.update(userId.value, {
      name: userForm.name,
      surname: userForm.surname
    })
    store.setUser(data)
    ElMessage.success('Изменения применены')
    gsap.to('.save-btn', { scale: 1.02, duration: 0.1, yoyo: true, repeat: 1 })
  } catch (e) {
    ElMessage.error('Проверьте поля')
  } finally {
    saving.value = false
  }
}

const syncFormWithData = (data) => {
  if (!data) return
  userForm.name = data.name || ''
  userForm.surname = data.surname || ''
  userForm.login = data.login || ''
  userForm.avatar = data.avatar || ''
}

const fetchUserData = async () => {
  try {
    const { data } = await UserService.user.getCurrentUser()
    userId.value = data._id
    syncFormWithData(data)
    store.setUser(data)
    loading.value = false
    await nextTick(() => animateEntry())
  } catch (e) {
    ElMessage.error('Ошибка получения данных')
    loading.value = false
  }
}

const handleMagnetic = (e) => {
  const card = avatarCardRef.value?.$el
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left - rect.width / 2) * 0.01
  const y = (e.clientY - rect.top - rect.height / 2) * 0.01

  gsap.to(card, {
    x,
    y,
    rotationY: x * 0.2,
    rotationX: -y * 0.2,
    duration: 0.6,
    overwrite: true
  })
}

const resetMagnetic = () => {
  const card = avatarCardRef.value?.$el
  if (!card) return
  gsap.to(card, { x: 0, y: 0, rotationY: 0, rotationX: 0, duration: 1, ease: 'power2.out' })
}

onMounted(fetchUserData)
</script>

<style scoped lang="scss">
.page-profile {
  position: relative;
  min-height: 100%;
  padding: 60px 20px;
  background-color: var(--el-bg-color-page);
  overflow: hidden;
  z-index: 1;

  .lava-container {
    position: absolute;
    inset: 0;
    z-index: -1;
    filter: blur(80px);
    opacity: 0.5;
    pointer-events: none;
    overflow: hidden;

    .lava-blob {
      position: absolute;
      border-radius: 50%;
      will-change: transform;
    }

    .lava-1 {
      width: 500px;
      height: 500px;
      top: -10%;
      left: -5%;
      background: var(--el-color-primary-light-3);
    }
    .lava-2 {
      width: 400px;
      height: 400px;
      bottom: -10%;
      right: -5%;
      background: var(--el-color-success-light-5);
    }
    .lava-3 {
      width: 300px;
      height: 300px;
      top: 30%;
      left: 40%;
      background: var(--el-color-warning-light-5);
      opacity: 0.3;
    }
  }

  .profile-header {
    max-width: 1000px;
    margin: 0 auto 50px;
    text-align: center;
    .page-title {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
    }
    .page-subtitle {
      color: var(--el-text-color-secondary);
      font-size: 1.1rem;
    }
  }

  .profile-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .glass-card {
    height: 100%;
    background: var(--el-bg-color) !important;
    backdrop-filter: blur(10px);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 24px;
    transition: border-color 0.4s ease;
    &:hover {
      border-color: var(--el-border-color);
    }
  }

  .avatar-card {
    padding: 40px 20px;
    display: flex;
    justify-content: center;

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .avatar-wrapper {
      position: relative;
      border-radius: 50%;
      cursor: pointer;
      overflow: hidden;
      width: 140px;
      height: 140px;
      display: flex;

      .upload-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: 0.3s ease;
        span {
          font-size: 12px;
          font-weight: 600;
          margin-top: 4px;
        }
      }
      &:hover .upload-overlay {
        opacity: 1;
      }
    }

    .user-info {
      text-align: center;
      .display-name {
        font-size: 1.6rem;
        font-weight: 800;
        margin: 15px 0 0;
      }
      .display-surname {
        font-size: 1.1rem;
        color: var(--el-text-color-secondary);
        margin: 4px 0 16px;
      }
    }
  }

  .form-card {
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
      }
      .header-icon {
        color: var(--el-color-primary);
        font-size: 20px;
      }
    }
  }

  .form-actions {
    margin-top: 100px;
    .save-btn {
      width: 100%;
      height: 48px;
      border-radius: 14px;
      font-weight: 700;
    }
  }
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  background: var(--el-fill-color-blank);
  box-shadow: 0 0 0 1px var(--el-border-color-lighter) inset;
  transition: 0.3s ease;
  &.is-focus {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
  }
}

:deep(.el-form-item__label) {
  font-weight: 700;
  color: var(--el-text-color-regular);
}

@media (max-width: 768px) {
  .profile-row {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}
</style>
