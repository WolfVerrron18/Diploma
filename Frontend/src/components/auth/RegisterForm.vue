<template>
  <el-form
    class="register-form"
    ref="formRef"
    label-position="top"
    :model="formBody"
    :rules="rules"
    status-icon
    @submit.prevent="submitForm(formRef)"
  >
    <div class="form-row">
      <el-form-item label="Имя" prop="name">
        <el-input v-model="formBody.name" placeholder="Иван" />
      </el-form-item>

      <el-form-item label="Фамилия" prop="surname">
        <el-input v-model="formBody.surname" placeholder="Иванов" />
      </el-form-item>
    </div>

    <el-form-item label="Логин" prop="login">
      <el-input v-model="formBody.login" placeholder="Придумайте логин" />
    </el-form-item>

    <el-form-item label="Пароль" prop="password">
      <el-input
        v-model="formBody.password"
        type="password"
        placeholder="Минимум 6 символов"
        show-password
      />
    </el-form-item>

    <el-form-item label="Повторите пароль" prop="repeatPassword">
      <el-input
        v-model="formBody.repeatPassword"
        type="password"
        placeholder="Повторите пароль"
        show-password
      />
    </el-form-item>

    <el-form-item>
      <el-button
        class="register-form__button"
        type="primary"
        native-type="submit"
        :loading="loadingSubmitButton"
        @click="submitForm(formRef)"
      >
        Зарегистрироваться
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  loadingSubmitButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onFormSubmitted'])

const formRef = ref(null)

const formBody = reactive({
  name: '',
  surname: '',
  login: '',
  password: '',
  repeatPassword: ''
})

// Кастомная валидация для проверки совпадения паролей
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Пожалуйста, повторите пароль'))
  } else if (value !== formBody.password) {
    callback(new Error('Пароли не совпадают!'))
  } else {
    callback()
  }
}

const rules = reactive({
  name: [{ required: true, message: 'Введите имя', trigger: 'blur' }],
  surname: [{ required: true, message: 'Введите фамилию', trigger: 'blur' }],
  login: [
    { required: true, message: 'Введите логин', trigger: 'blur' },
    { min: 3, message: 'Минимум 3 символа', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Придумайте пароль', trigger: 'blur' },
    { min: 6, message: 'Минимум 6 символов', trigger: 'blur' }
  ],
  repeatPassword: [{ validator: validatePass2, trigger: 'blur' }]
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      emit('onFormSubmitted', formBody, 'register')
    }
  })
}
</script>

<style scoped lang="scss">
.register-form {
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  &__button {
    width: 100%;
    margin-top: 10px;
  }

  :deep(.el-form-item__label) {
    color: var(--el-text-color-regular);
    font-weight: 600;
  }
}

// Планшетная/мобильная адаптация для строки Имя+Фамилия
@media (max-width: 480px) {
  .register-form .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
