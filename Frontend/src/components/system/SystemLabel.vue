<template>
  <div class="system-label">
    <!-- Заголовок поля -->
    <p v-if="label" class="system-label__label">{{ label }}</p>

    <slot />
  </div>
</template>

<script>
export default {
  name: 'SystemLabel',

  props: {
    /** @param {string} label - Заголовок */
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="scss">
.system-label {
  &__label {
    margin-bottom: 4px;
    color: var(--el-text-color-placeholder);
  }
}
</style>
