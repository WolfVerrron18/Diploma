<template>
  <div class="input">
    <!-- Заголовок поля -->
    <p v-if="label" class="input__label">{{ label }}</p>

    <!-- Поле ввода -->
    <el-input
      :class="{ input_required: required && !modelValue.length }"
      :disabled="disabled"
      :model-value="modelValue"
      :placeholder="placeholder"
      :type="typeField"
      :maxlength="20"
      @update:model-value="onValueUpdated"
      @change="onValueChanged"
    />
  </div>
</template>

<script>
export default {
  name: 'SystemInput',

  props: {
    /** @param {string,number} modelValue - Значение поля */
    modelValue: {
      type: [String, Number],
      default: ''
    },

    /** @param {string,number} placeholder - Подсказка для ввода значения */
    placeholder: {
      type: [String, Number],
      default: ''
    },

    /** @param {string} label - Заголовок поля */
    label: {
      type: String,
      default: ''
    },

    /** @param {boolean} required - Обязательно ли поле к заполнению */
    required: {
      type: Boolean,
      default: false
    },

    /** @param {boolean} disabled - Заблокировано ли взаимодействие с полем */
    disabled: {
      type: Boolean,
      default: false
    },

    /** @param {string} typeField - Тип поля ввода */
    typeField: {
      type: String,
      default: 'text',
      validator(type) {
        return ['text', 'textarea'].includes(type)
      }
    }
  },

  emits: ['update:modelValue', 'change:modelValue'],

  setup(props, { emit }) {
    /** @function
     * @name onValueUpdated - Значение поля обновлено */
    const onValueUpdated = (value) => {
      emit('update:modelValue', value)
    }

    /** @function
     * @name onValueChanged - Значение поля изменилось */
    const onValueChanged = (value) => {
      emit('change:modelValue', value)
    }

    return { onValueUpdated, onValueChanged }
  }
}
</script>

<style scoped lang="scss">
.input {
  :deep(.el-input__wrapper) {
    transition: all 0.25s ease-in-out;
  }

  &__label {
    margin-bottom: 4px;
    color: var(--el-text-color-placeholder);
  }

  &_required {
    :deep(.el-input__wrapper) {
      background: var(--el-color-danger-light-7);
    }
  }
}
</style>
