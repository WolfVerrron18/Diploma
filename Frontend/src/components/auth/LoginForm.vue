<template>
  <el-form
    class="login-form"
    ref="formRef"
    label-position="top"
    :model="formBody"
    :rules="rules"
    status-icon
    @submit.prevent="submitForm(formRef)"
  >
    <el-form-item label="Логин" prop="login">
      <el-input v-model="formBody.login" placeholder="Введите ваш логин" />
    </el-form-item>

    <el-form-item label="Пароль" prop="password">
      <el-input
        v-model="formBody.password"
        type="password"
        placeholder="Введите пароль"
        show-password
      />
    </el-form-item>

    <el-form-item label="Как вы себя чувствуете?" prop="mood">
      <el-segmented
        v-model="formBody.mood"
        :options="moodOptions"
        block
        class="mood-selector"
        @update:model-value="applyMoodTheme"
      >
        <template #default="{ item }">
          <div class="mood-item">
            <el-icon size="20">
              <component :is="item.icon" />
            </el-icon>
            <span class="mood-item__label">{{ item.label }}</span>
          </div>
        </template>
      </el-segmented>
    </el-form-item>

    <el-form-item>
      <el-button
        class="login-form__button"
        type="primary"
        :loading="loadingSubmitButton"
        @click="submitForm(formRef)"
      >
        Войти и начать рефлексию
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Sunny, Coffee, Lightning, Sunrise, ColdDrink } from '@element-plus/icons-vue' // Импортируем иконки Element

import { applyMoodTheme } from '@/data/ColorThemes.js'

defineProps({
  loadingSubmitButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onFormSubmitted'])

const formRef = ref(null)

const moodOptions = [
  { label: 'Обычное', value: 'default', icon: ColdDrink, color: '#409eff' }, // Дефолт
  { label: 'Спокойствие', value: 'calm', icon: Coffee, color: '#409eff' },
  { label: 'Драйв', value: 'productive', icon: Lightning, color: '#ff9900' },
  { label: 'Стресс', value: 'stressed', icon: Sunny, color: '#95d475' },
  { label: 'Усталость', value: 'tired', icon: Sunrise, color: '#b1b3b8' }
]

const formBody = reactive({
  login: '',
  password: '',
  mood: '' // Устанавливаем дефолт здесь
})

// Правила валидации — обязательный пункт для ElForm
const rules = reactive({
  login: [
    { required: true, message: 'Пожалуйста, введите логин', trigger: 'blur' },
    { min: 3, message: 'Логин должен быть не менее 3 символов', trigger: 'blur' }
  ],
  password: [
    { required: false, message: 'Пожалуйста, введите пароль', trigger: 'blur' },
    { min: 0, message: 'Пароль должен быть не менее 6 символов', trigger: 'blur' }
  ]
})

const submitForm = async (formEl) => {
  if (!formEl) return

  // Используем современный async/await для валидации
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('onFormSubmitted', formBody, 'login')
    } else {
      console.error('Ошибка валидации:', fields)
    }
  })
}
</script>

<style scoped lang="scss">
.mood-selector {
  // Фикс высоты: убираем жесткие ограничения Element Plus
  :deep(.el-segmented__item) {
    height: auto !important;
    padding: 6px 4px !important;
  }

  // Делаем активный ползунок (тот самый квадрат) подстраивающимся под контент
  :deep(.el-segmented__item-selected) {
    background-color: var(--el-color-primary) !important;
    color: white !important;
  }
}

.mood-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px; // Даем место тексту
  gap: 4px;

  &__label {
    font-size: 10px; // Чуть уменьшим шрифт, чтобы влезло в ряд
    line-height: 1;
    text-align: center;
    white-space: nowrap; // Чтобы не переносилось криво
  }

  .el-icon {
    margin-bottom: 2px;
  }
}

.login-form__button {
  display: flex;
  width: 100%;
}
</style>
