<template>
  <SystemModal
    :model-value="modelValue"
    :width="400"
    :height="400"
    :title="cardTitle[mode]"
    :show-footer="isMode.create"
    @on-hide-modal="onHideModal"
  >
    <template #content>
      <div class="category__wrapper" :class="{ 'category__wrapper-overlay': loading.card }">
        <!-- Название -->
        <SystemInput
          v-model="category.name"
          class="category__item"
          label="Название"
          @change:model-value="updateCategory"
        />

        <!-- Описание -->
        <SystemInput
          v-model="category.description"
          class="category__item"
          style="width: 240px"
          label="Описание"
          type-field="textarea"
          placeholder="Введите описание"
          @change:model-value="updateCategory"
        />

        <!-- Приоритет -->
        <SystemSelect
          class="category__item"
          v-model="category.type"
          :options="types"
          label="Тип категори"
          placeholder="Выберите тип категории"
          @update:model-value="updateCategory"
        />

        <SystemColorPicker
          label="Цвет"
          v-model="category.color"
          @update:model-value="updateCategory"
        />
      </div>
    </template>

    <template #footer>
      <el-button @click="onHideModal"> Отмена </el-button>

      <el-button
        type="primary"
        :disabled="isContentChanged"
        :loading="loading.button"
        @click="createCategory"
      >
        Сохранить
      </el-button>
    </template>
  </SystemModal>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'

import { isEqual } from 'lodash'

import { CategoryModel } from '@/components/categories/card/category/model/CategoryModel.js'

import CategoryService from '@/components/categories/service/CategoryService.js'

import { typeCategories, enumTypeCategories } from '@/components/categories/enums/enumCategories.js'

import SystemModal from '@/components/system/SystemModal.vue'
import SystemInput from '@/components/system/SystemInput.vue'
import SystemSelect from '@/components/system/SystemSelect.vue'
import SystemColorPicker from '@/components/system/SystemColorPicker.vue'

export default {
  name: 'CategoryCard',

  components: { SystemColorPicker, SystemSelect, SystemInput, SystemModal },

  props: {
    /** @param {string} id - Идентификатор категории */
    id: {
      type: String,
      default: '',
      required: true
    },

    /** @param {boolean} modelValue - Видимость карточки */
    modelValue: {
      type: Boolean,
      default: false
    },

    /** @param {object} defaultData - Данные карточки по умолчанию */
    defaultData: {
      type: Object,
      default: () => ({})
    },

    /** @param {string} mode - Режим работы с карточкой */
    mode: {
      type: String,
      default: 'edit',
      validator(mode) {
        return ['create', 'edit'].includes(mode)
      }
    }
  },

  emits: ['onHideModal', 'update:modelValue', 'onObjectCreated', 'onObjectUpdated'],

  setup(props, { emit }) {
    const category = ref({})
    const model = ref({})

    const selectedCategory = ref('')

    const loading = reactive({
      button: false,
      card: false
    })

    const types = [
      {
        label: typeCategories[enumTypeCategories.income],
        value: enumTypeCategories.income
      },
      {
        label: typeCategories[enumTypeCategories.expenditure],
        value: enumTypeCategories.expenditure
      }
    ]

    /** @computed
     * @name isMode - Определение режима с модальным окном */
    const isMode = computed(() => ({
      create: props.mode === 'create',
      edit: props.mode === 'edit'
    }))

    /** @computed
     * @name cardTitle - Заголовки модального окна */
    const cardTitle = computed(() => ({
      create: 'Cоздание категории',
      edit: `Категория "${model.value.name}"`
    }))

    /** @computed
     * @name isContentChanged - Изменился ли контент карточки */
    const isContentChanged = computed(() => {
      return isEqual(category.value, model.value)
    })

    const createCategory = async () => {
      loading.button = true

      try {
        const { data } = await CategoryService.categories.create(category.value)

        emit('onObjectCreated', data)
      } finally {
        loading.button = false
      }
    }

    const updateCategory = async () => {
      loading.card = true

      try {
        const { data } = await CategoryService.categories.update(category.value._id, category.value)

        category.value = data
        model.value = { ...data }

        emit('onObjectUpdated', data)
      } finally {
        loading.card = false
      }
    }

    const getCategory = async () => {
      loading.card = true

      try {
        const { data } = await CategoryService.categories.get(props.id)

        category.value = data
        model.value = { ...data }
      } finally {
        loading.card = false
      }
    }

    /** @function
     * @name onUpdateVisible - Обновление видимости модального окна */
    const onUpdateVisible = () => emit('update:modelValue')

    const initCategory = () => {
      if (isMode.value.create) {
        category.value = new CategoryModel(props.defaultData)
        model.value = new CategoryModel(props.defaultData)
      } else if (props.modelValue) {
        getCategory()
      }
    }

    watch(
      () => props.modelValue,
      () => {
        initCategory()
      },
      { immediate: true }
    )

    /** @function
     * @name onHideModal - Закрытие модального окна */
    const onHideModal = () => emit('onHideModal')

    return {
      category,
      loading,
      selectedCategory,
      types,
      isMode,
      cardTitle,
      isContentChanged,
      updateCategory,
      onHideModal,
      onUpdateVisible,
      createCategory
    }
  }
}
</script>

<style scoped lang="scss">
.category {
  &__wrapper {
    padding: 24px;
    height: 100%;
    overflow: auto;
    position: relative;

    &-overlay {
      &::before {
        content: '';
        position: absolute;
        background: white;
        opacity: 0.4;
        z-index: 999;
        height: calc(100% - 48px);
        width: calc(100% - 24px);
      }
    }
  }

  &__item:not(:last-child) {
    margin-bottom: 16px;
  }
}
</style>
