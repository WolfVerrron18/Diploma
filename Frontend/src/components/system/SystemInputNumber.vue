<template>
  <div class="input-number">
    <!-- Заголовок поля -->
    <p v-if="label" class="input-number__label">{{ label }}</p>

    <!-- Поле ввода -->
    <el-input-number
      :model-value="modelValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      :controls-position="controlPosition"
      @update:model-value="onValueUpdated"
    >
      <!-- Иконка увеличения значения -->
      <template #decrease-icon>
        <el-icon> <Minus /> </el-icon>
      </template>

      <!-- Иконка уменьшения значения -->
      <template #increase-icon>
        <el-icon> <Plus /> </el-icon>
      </template>
    </el-input-number>
  </div>
</template>

<script>
/** @module Icons - Иконки */
import { Minus, Plus } from '@element-plus/icons-vue'

export default {
  name: 'SystemInputNumber',

  components: { Minus, Plus },

  props: {
    /** @param {number} modelValue - Значение поля */
    modelValue: {
      type: Number,
      default: 0
    },

    /** @param {string} controlPosition - Расположение контролов поля */
    controlPosition: {
      type: String,
      default: 'right',
      validator(position) {
        return ['', 'right'].includes(position)
      }
    },

    /** @param {number} min - Минимальное значение поля */
    min: {
      type: Number,
      default: 0
    },

    /** @param {number} max - Максимальное значение поля */
    max: {
      type: Number,
      default: Infinity
    },

    /** @param {boolean} disabled - Заблокировано ли взаимодействие с полем */
    disabled: {
      type: Boolean,
      default: false
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
     * @name onValueUpdated - Значение поля было обновлено */
    const onValueUpdated = (value) => emit('update:modelValue', value)

    return { onValueUpdated }
  }
}
</script>

<style scoped lang="scss">
.input-number {
  &__label {
    margin-bottom: 4px;
    color: var(--el-text-color-placeholder);
  }
}
</style>
