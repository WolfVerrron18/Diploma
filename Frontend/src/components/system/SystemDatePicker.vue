<template>
  <div class="system-date-picker">
    <!-- Заголовок поля -->
    <p v-if="label" class="system-date-picker__label">{{ label }}</p>

    <!-- Контрол выбора цвета -->
    <el-date-picker type="datetime" :model-value="modelValue" @update:model-value="onDateChanged" />
  </div>
</template>

<script>
export default {
  name: 'SystemDatePicker',

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
     * @name onDateChanged - Дата была изменена */
    const onDateChanged = (color) => {
      emit('update:modelValue', color)
    }

    return { onDateChanged }
  }
}
</script>

<style scoped lang="scss">
.system-date-picker {
  &__label {
    margin-bottom: 4px;
    color: var(--el-text-color-placeholder);
  }
}
</style>
