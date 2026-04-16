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
      <el-input v-model="formBody.login" placeholder="Введите ваш логин" autocomplete="username" />
    </el-form-item>

    <el-form-item label="Пароль" prop="password">
      <el-input
        v-model="formBody.password"
        type="password"
        placeholder="Введите пароль"
        autocomplete="current-password"
        show-password
      />
    </el-form-item>

    <el-form-item>
      <el-button
        class="login-form__button"
        type="primary"
        :loading="loadingSubmitButton"
        native-type="submit"
        @click="submitForm(formRef)"
      >
        Войти
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

// Используем script setup, так как всё приложение переводим на него
const props = defineProps({
  loadingSubmitButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onFormSubmitted'])

const formRef = ref(null)

const formBody = reactive({
  login: '',
  password: ''
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
.login-form {
  // Используем переменные Element Plus для фона и границ, если форма находится в контейнере
  background-color: var(--el-bg-color-overlay);
  padding: 30px;
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color-light);
  box-shadow: var(--el-box-shadow-light);
  transition: all 0.3s ease;

  &__button {
    width: 100%;
    margin-top: 10px;
    // Кнопка автоматически сменит оттенок в темной теме
  }

  // Настройка цвета лейблов под тему
  :deep(.el-form-item__label) {
    color: var(--el-text-color-regular);
    font-weight: 600;
  }
}
</style>
