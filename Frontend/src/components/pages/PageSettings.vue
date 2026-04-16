<template>
  <div class="page-profile">
    <header class="profile-header">
      <h1 class="page-title" ref="titleRef">Настройки профиля</h1>
    </header>

    <div class="profile-container" v-loading="loading">
      <el-row :gutter="24" v-if="!loading">
        <el-col :xs="24" :sm="8" class="col-avatar">
          <el-card
            class="avatar-card stage-1"
            shadow="never"
            @mousemove="handleMagnetic"
            @mouseleave="resetMagnetic"
            ref="avatarCardRef"
          >
            <div class="avatar-section">
              <el-upload
                class="avatar-picker"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAvatarChange"
                accept="image/*"
              >
                <el-avatar
                  :size="160"
                  :src="userForm.avatar || defaultAvatar"
                  class="current-avatar"
                />
                <div class="upload-overlay">
                  <el-icon class="camera-icon"><Camera /></el-icon>
                  <span>Обновить</span>
                </div>
              </el-upload>

              <h2 class="display-name">{{ userForm.name || 'Имя' }}</h2>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="16" class="col-form">
          <el-card class="form-card stage-2" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon><User /></el-icon>
                <span>Личные данные</span>
              </div>
            </template>

            <el-form :model="userForm" label-position="top" ref="profileFormRef" :rules="rules">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="Имя" prop="name" class="form-item-anim">
                    <el-input v-model="userForm.name" placeholder="Введите имя" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Фамилия" prop="surname" class="form-item-anim">
                    <el-input v-model="userForm.surname" placeholder="Введите фамилию" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="Логин" prop="login" class="form-item-anim">
                <el-input v-model="userForm.login" disabled>
                  <template #prefix
                    ><el-icon><Lock /></el-icon
                  ></template>
                </el-input>
              </el-form-item>

              <div class="form-actions form-item-anim">
                <el-button type="primary" :loading="saving" class="save-btn" @click="saveProfile">
                  <el-icon v-if="!saving"><Check /></el-icon>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera, User, Lock, Check } from '@element-plus/icons-vue'
import UserService from '@/services/UserService.js'
import { useUserStore } from '@/stores/user.js'
import { gsap } from 'gsap'

const store = useUserStore()
const profileFormRef = ref(null)
const avatarCardRef = ref(null)
const loading = ref(true)
const saving = ref(false)
const userId = ref(null)
const defaultAvatar = 'https://i.ytimg.com/vi/q3XULScESEA/maxresdefault.jpg'

const userForm = reactive({
  name: '',
  surname: '',
  login: '',
  avatar: ''
})

const rules = {
  name: [{ required: true, message: 'Укажите ваше имя', trigger: 'blur' }],
  surname: [{ required: true, message: 'Укажите фамилию', trigger: 'blur' }]
}

// Магнитный эффект с оптимизацией
const handleMagnetic = (e) => {
  const card = avatarCardRef.value?.$el
  if (!card) return

  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2

  gsap.to(card, {
    x: x * 0.1,
    y: y * 0.1,
    rotationY: x * 0.05,
    rotationX: -y * 0.05,
    duration: 0.5,
    ease: 'power2.out',
    overwrite: true // Важно: прерывает предыдущую анимацию
  })
}

const resetMagnetic = () => {
  const card = avatarCardRef.value?.$el
  if (!card) return

  gsap.to(card, {
    x: 0,
    y: 0,
    rotationY: 0,
    rotationX: 0,
    duration: 0.8,
    ease: 'elastic.out(1, 0.3)',
    overwrite: true
  })
}

const syncFormWithData = (data) => {
  if (!data) return
  userForm.name = data.name || ''
  userForm.surname = data.surname || ''
  userForm.login = data.login || ''
  userForm.avatar = data.avatar || ''
}

const fetchUserData = async () => {
  // Если в сторе уже есть данные, покажем их сразу (пре-лоадинг)
  if (store.getUser?.login) {
    syncFormWithData(store.getUser)
    userId.value = store.getUser._id
    loading.value = false
  }

  try {
    const { data } = await UserService.user.getCurrentUser()
    userId.value = data._id
    syncFormWithData(data)
    store.setUser(data)
  } catch (e) {
    ElMessage.error('Ошибка загрузки данных')
  } finally {
    loading.value = false
  }
}

const handleAvatarChange = (file) => {
  const isImage = file.raw.type.startsWith('image/')
  const isLt2M = file.raw.size / 1024 / 1024 < 2

  if (!isImage) return ElMessage.error('Выберите изображение')
  if (!isLt2M) return ElMessage.error('Размер фото до 2 МБ')

  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    userForm.avatar = reader.result
    gsap.fromTo(
      '.current-avatar',
      { filter: 'brightness(2)', scale: 0.9 },
      { filter: 'brightness(1)', scale: 1, duration: 0.6, ease: 'back.out(2)' }
    )
  }
}

const saveProfile = async () => {
  if (!profileFormRef.value) return

  try {
    const valid = await profileFormRef.value.validate()
    if (!valid) return

    saving.value = true
    const payload = {
      name: userForm.name,
      surname: userForm.surname,
      avatar: userForm.avatar
    }

    const { data } = await UserService.user.update(userId.value, payload)
    store.setUser(data) // Синхронизируем стор

    ElMessage.success('Профиль обновлен')
    gsap.to('.save-btn', { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 })
  } catch (e) {
    // В Element Plus validate выбрасывает ошибку, если валидация не прошла
    if (e) ElMessage.error('Ошибка при сохранении')
  } finally {
    saving.value = false
  }
}

onMounted(fetchUserData)
</script>

<style scoped lang="scss">
/* Стили остаются без изменений, так как структура классов сохранена */
.page-profile {
  padding: 30px;
  background-color: var(--el-bg-color-page);
  min-height: 100vh;
  perspective: 1200px;

  .profile-header {
    max-width: 1000px;
    margin: 0 auto 30px;
    .page-title {
      font-size: 2rem;
      font-weight: 900;
      color: var(--el-text-color-primary);
    }
  }

  .profile-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .avatar-card {
    border-radius: 20px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
    }

    .avatar-picker {
      width: 176px;
      height: 176px;
      border: 2px dashed var(--el-border-color);
      padding: 6px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        .upload-overlay {
          opacity: 1;
        }
      }

      .upload-overlay {
        position: absolute;
        width: 160px;
        height: 160px;
        background: rgba(var(--el-color-primary-rgb), 0.7);
        backdrop-filter: blur(4px);
        color: white;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
        .camera-icon {
          font-size: 24px;
          margin-bottom: 4px;
        }
        span {
          font-size: 11px;
          font-weight: bold;
          text-transform: uppercase;
        }
      }
    }

    .display-name {
      margin-top: 24px;
      font-size: 1.4rem;
      font-weight: 800;
    }
  }

  .form-card {
    border-radius: 20px;
    .card-header {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
    }
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 32px;
    .el-button {
      border-radius: 10px;
      font-weight: bold;
    }
  }
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  &:hover,
  &.is-focus {
    border-color: var(--el-color-primary);
  }
}
</style>
