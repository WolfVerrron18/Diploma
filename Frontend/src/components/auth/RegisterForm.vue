<template>
  <el-form
    class="register-form"
    ref="formRef"
    label-position="top"
    :model="formBody"
    :status-icon="true"
  >
    <el-form-item label="Имя">
      <el-input v-model.number="formBody.name" autocomplete="off" />
    </el-form-item>

    <el-form-item label="Фамилия">
      <el-input v-model.number="formBody.surname" autocomplete="off" />
    </el-form-item>

    <el-form-item label="Логин">
      <el-input v-model.number="formBody.login" autocomplete="off" />
    </el-form-item>

    <el-form-item label="Пароль">
      <el-input
        v-model="formBody.password"
        type="password"
        placeholder="Введите пароль"
        show-password
      />
    </el-form-item>

    <el-form-item label="Повторите пароль">
      <el-input
        v-model="formBody.repeatPassword"
        type="password"
        placeholder="Введите пароль"
        show-password
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(formRef)">Зарегистрироваться</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, ref } from 'vue'

export default {
  name: 'RegisterForm',

  emit: ['onFormSubmitted'],

  props: {
    loadingSubmitButton: {
      type: Boolean,
      default: false
    }
  },

  setup(props, { emit }) {
    const formRef = ref(null)

    const formBody = reactive({
      name: '',
      surname: '',
      login: '',
      password: '',
      repeatPassword: ''
    })

    const submitForm = (formEl) => {
      if (!formEl) return

      formEl.validate((valid) => {
        if (valid) {
          emit('onFormSubmitted', formBody, 'register')
        } else {
          console.log('error submit!')
          return false
        }
      })
    }

    return {
      formRef,
      formBody,
      submitForm
    }
  }
}
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
