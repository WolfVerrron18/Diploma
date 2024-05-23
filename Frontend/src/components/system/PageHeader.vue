<template>
  <div class="page-header">
    <!-- Заголовок -->
    <h2 class="page-header__title">{{ title }}</h2>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',

  props: {
    /** @param {string} title - Заголовок страницы */
    title: {
      type: String,
      default: ''
    },

    /** @param {string} buttonText - Текст кнопки */
    buttonText: {
      type: String,
      default: ''
    }
  },

  emits: ['onButtonClicked']
}
</script>

<style scoped lang="scss">
.page-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--el-border-color);

  &__title {
    color: var(--el-text-color-primary);
    font-size: 20px;
  }
}
</style>
