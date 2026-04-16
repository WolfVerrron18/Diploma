<template>
  <SystemModal
    :model-value="modelValue"
    :width="400"
    :height="400"
    :title="cardTitle[mode]"
    @on-hide-modal="onHideModal"
  >
    <!-- Контент карточки -->
    <template #content>
      <div class="note__wrapper" :class="{ 'note__wrapper-overlay': loading.card }">
        <!-- Название -->
        <SystemInput
          v-model="category.name"
          class="note__item"
          label="Название"
          @change:model-value="updateCategory"
        />

        <!-- Описание -->
        <SystemInput
          v-model="category.description"
          class="note__item"
          style="width: 240px"
          label="Описание"
          type-field="textarea"
          placeholder="Введите описание"
          @change:model-value="updateCategory"
        />

        <!-- Состояние -->
        <SystemSelect
          class="note__item"
          v-model="category.type"
          :options="types"
          label="Состояние"
          placeholder="Выберите состояние"
          @update:model-value="updateCategory"
        />

        <!-- Приоритет -->
        <SystemSelect
          class="note__item"
          v-model="category.priority"
          :options="priorities"
          label="Приоритет"
          placeholder="Выберите приоритет"
          @update:model-value="updateCategory"
        />

        <!-- Дата создания -->
        <SystemDatePicker
          v-if="isMode.edit"
          v-model="category.dateCreation"
          class="note__item"
          label="Дата создания"
          :disabled="isMode.edit"
        />
      </div>
    </template>

    <!-- Кнопки карточки -->
    <template #footer>
      <el-button v-if="isMode.create" @click="onHideModal"> Отмена </el-button>

      <el-button
        v-if="isMode.create"
        type="primary"
        :disabled="isContentChanged"
        :loading="loading.button"
        @click="createCategory"
      >
        Сохранить
      </el-button>

      <el-button v-if="isMode.edit" type="danger" :loading="loading.button" @click="removeCategory">
        Удалить
      </el-button>
    </template>
  </SystemModal>
</template>

<script>
import { computed, reactive, ref, watch } from 'vue'

/** @module lodash - Библиотека вспомогательных функций */
import { isEqual } from 'lodash'

/** @class CategoryModel - Базовый класс категории */
import { CategoryModel } from '@/components/categories/card/model/CategoryModel.js'

/** @class CategoryService - Сервис для работы с категориями */
import CategoryService from '@/components/categories/service/CategoryService.js'

/** @module Components - Системные компоненты */
import SystemModal from '@/components/system/SystemModal.vue'
import SystemInput from '@/components/system/SystemInput.vue'
import SystemSelect from '@/components/system/SystemSelect.vue'
import { enumPriorities, enumStatusNotes } from '@/components/notes/enums/enumNotes.js'
import { noteLabels, priorityLabels } from '@/components/notes/data/NotesData.js'
import SystemDatePicker from '@/components/system/SystemDatePicker.vue'

export default {
  name: 'NoteCard',

  components: { SystemDatePicker, SystemSelect, SystemInput, SystemModal },

  props: {
    /** @param {string} id - Идентификатор категории */
    id: {
      type: String,
      default: ''
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
        label: noteLabels[enumStatusNotes.completed],
        value: enumStatusNotes.completed
      },
      {
        label: noteLabels[enumStatusNotes.inPlans],
        value: enumStatusNotes.inPlans
      },
      {
        label: noteLabels[enumStatusNotes.frozen],
        value: enumStatusNotes.frozen
      }
    ]

    const priorities = [
      {
        label: priorityLabels[enumPriorities.low],
        value: enumPriorities.low
      },
      {
        label: priorityLabels[enumPriorities.middle],
        value: enumPriorities.middle
      },
      {
        label: priorityLabels[enumPriorities.high],
        value: enumPriorities.high
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
      create: 'Создание задачи',
      edit: `Задача: "${model.value.name}"`
    }))

    /** @computed
     * @name isContentChanged - Изменился ли контент карточки */
    const isContentChanged = computed(() => {
      return isEqual(category.value, model.value)
    })

    /** @function
     * @name createCategory - Создание категории */
    const createCategory = async () => {
      loading.button = true

      try {
        const { data } = await CategoryService.categories.create(category.value)

        emit('onObjectCreated', data)
      } finally {
        loading.button = false
      }
    }

    /** @function
     * @name removeCategory - Удаление категории */
    const removeCategory = async () => {
      loading.button = true

      try {
        await CategoryService.categories.remove(category.value._id)

        emit('onObjectRemoved', category.value._id)
      } finally {
        loading.button = false
      }
    }

    /** @function
     * @name updateCategory - Обновление категории */
    const updateCategory = async () => {
      if (isMode.value.create) return

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

    /** @function
     * @name getCategory - Получение категории */
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

    /** @function
     * @name initCategory - Инициализация категории */
    const initCategory = () => {
      if (isMode.value.create) {
        category.value = new CategoryModel(props.defaultData)
        model.value = new CategoryModel(props.defaultData)
      } else if (props.modelValue) {
        getCategory()
      }
    }

    /** @function
     * @name onHideModal - Закрытие модального окна */
    const onHideModal = () => emit('onHideModal')

    watch(
      () => props.modelValue,
      () => initCategory(),
      { immediate: true }
    )

    return {
      category,
      loading,
      priorities,
      selectedCategory,
      types,
      isMode,
      cardTitle,
      isContentChanged,
      removeCategory,
      updateCategory,
      onHideModal,
      onUpdateVisible,
      createCategory
    }
  }
}
</script>

<style scoped lang="scss">
.note {
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
