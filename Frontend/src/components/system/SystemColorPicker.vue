<template>
  <div class="system-color-picker">
    <!-- Заголовок поля -->
    <p v-if="label" class="system-color-picker__label">{{ label }}</p>

    <!-- Контрол выбора цвета -->
    <el-color-picker :model-value="modelValue" @update:model-value="onColorSelected" />
  </div>
</template>

<script>
export default {
  name: 'SystemColorPicker',

  props: {
    /** @param {string} modelValue - Значение поля */
    modelValue: {
      type: String,
      default: ''
    },

    /** @param {string} label - Заголовок поля */
    label: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    /** @function
     * @name onColorSelected - Цвет был выбран */
    const onColorSelected = (color) => {
      emit('update:modelValue', color)
    }

    return { onColorSelected }
  }
}
</script>

<style scoped lang="scss">
.system-color-picker {
  &__label {
    margin-bottom: 4px;
    color: var(--el-text-color-placeholder);
  }
}
</style>
