<template>
  <el-form
    class="login-form"
    ref="formRef"
    label-position="top"
    :model="formBody"
    :status-icon="true"
  >
    <el-form-item label="Логин">
      <el-input v-model="formBody.login" autocomplete="off" />
    </el-form-item>

    <el-form-item label="Пароль">
      <el-input
        v-model="formBody.password"
        type="password"
        placeholder="Введите пароль"
        autocomplete="off"
        show-password
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" :loading="loadingSubmitButton" @click="submitForm(formRef)">
        Войти
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive, ref } from 'vue'

export default {
  name: 'LoginForm',

  props: {
    loadingSubmitButton: {
      type: Boolean,
      default: false
    }
  },

  emit: ['onFormSubmitted'],

  setup(props, { emit }) {
    const formRef = ref(null)

    const formBody = reactive({
      login: '',
      password: ''
    })

    const submitForm = (formEl) => {
      if (!formEl) return

      formEl.validate((valid) => {
        if (valid) {
          emit('onFormSubmitted', formBody, 'login')
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
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
