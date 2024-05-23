<template>
  <div class="select">
    <!-- Заголовок выпадающего списка -->
    <p v-if="label" class="select__label">{{ label }}</p>

    <!-- Поле выпадающего списка -->
    <el-select
      :model-value="modelValue"
      :placeholder="placeholder"
      :size="size"
      :loading="loading"
      @update:model-value="onOptionSelected"
    >
      <!-- Опции выбора выпадающего списка -->
      <el-option
        v-for="item in options"
        :key="item[keyIterationValue]"
        :label="item[keyIterationLabel]"
        :value="item[keyIterationValue]"
      >
        <slot name="option" :option="item" />
      </el-option>

      <template #prefix>
        <slot name="prefix" />
      </template>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'SystemSelect',

  props: {
    /** @param {string} label - Заголовок */
    label: {
      type: String,
      default: ''
    },

    /** @param {string,number} modelValue - Значение поля */
    modelValue: {
      type: [String, Number],
      default: ''
    },

    /** @param {string,number} placeholder - Подсказка для поля */
    placeholder: {
      type: [String, Number],
      default: ''
    },

    /** @param {array} options - Опции выбора */
    options: {
      type: Array,
      default: () => []
    },

    /** @param {boolean} loading - Идёт ли загрузка */
    loading: {
      type: Boolean,
      default: false
    },

    /** @param {string} keyIterationValue - Ключ итерации значения опции */
    keyIterationValue: {
      type: String,
      default: 'value'
    },

    /** @param {string} keyIterationLabel - Ключ итерации заголовка опции */
    keyIterationLabel: {
      type: String,
      default: 'label'
    },

    /** @param {string} size - Размер поля */
    size: {
      type: String,
      default: '',
      validator(selectedSize) {
        return ['', 'large', 'default', 'small'].includes(selectedSize)
      }
    }
  },

  emits: ['update:modelValue'],

  setup(props, { emit }) {
    /** @function
     * @name onOptionSelected - Опции списка была выбрана */
    const onOptionSelected = (value) => {
      emit('update:modelValue', value)
    }

    return { onOptionSelected }
  }
}
</script>

<style scoped lang="scss">
.select {
  &__label {
    margin-bottom: 4px;
    color: var(--el-text-color-placeholder);
  }
}
</style>
