<template>
  <SystemModal
    :model-value="modelValue"
    :width="460"
    :title="cardTitle[mode]"
    :height="500"
    @on-hide-modal="onHideModal"
  >
    <template #content>
      <div class="note-edit-form" :class="{ 'is-loading': loading.card }">
        <!-- Название и описание (без изменений) -->
        <div class="form-group">
          <label class="form-label">Название</label>
          <el-input
            v-model="category.name"
            placeholder="О чем вы думаете?"
            @change="updateCategory"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Детали и мысли</label>
          <el-input
            v-model="category.description"
            type="textarea"
            :rows="3"
            placeholder="Разверните вашу мысль здесь..."
            @change="updateCategory"
          />
        </div>

        <!-- Состояние с динамическим цветом из rowStyleStates -->
        <div class="form-group">
          <label class="form-label">Состояние</label>
          <el-segmented
            v-model="category.type"
            :options="statusOptions"
            block
            class="state-segmented"
            :style="{ '--active-state-color': rowStyleStates[category.type] }"
            @change="updateCategory"
          >
            <template #default="{ item }">
              <div class="segmented-item">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </template>
          </el-segmented>
        </div>

        <!-- Приоритет с динамическим цветом из rowStylePriorities -->
        <div class="form-group">
          <label class="form-label">Важность (Приоритет)</label>
          <el-segmented
            v-model="category.priority"
            :options="priorityOptions"
            block
            class="priority-segmented"
            :style="{ '--active-priority-color': rowStylePriorities[category.priority] }"
            @change="updateCategory"
          />
        </div>

        <div v-if="isMode.edit" class="form-group date-info">
          <el-icon><Calendar /></el-icon>
          <span>Создано: {{ category.dateCreation?.split('T')[0] }}</span>
        </div>
      </div>
    </template>

    <!-- Footer без изменений -->
    <template #footer>
      <div class="modal-footer">
        <el-button v-if="isMode.create" @click="onHideModal">Отмена</el-button>
        <el-button
          v-if="isMode.create"
          type="primary"
          round
          :disabled="isContentChanged"
          :loading="loading.button"
          @click="createCategory"
          >Зафиксировать</el-button
        >
        <el-button
          v-if="isMode.edit"
          type="danger"
          plain
          round
          :loading="loading.button"
          @click="removeCategory"
          >Удалить запись</el-button
        >
      </div>
    </template>
  </SystemModal>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue'
import { isEqual } from 'lodash'
import { Check, Timer, IceTea, Calendar } from '@element-plus/icons-vue'

import { CategoryModel } from '@/components/categories/card/model/CategoryModel.js'
import CategoryService from '@/components/categories/service/CategoryService.js'
import { enumPriorities, enumStatusNotes } from '@/components/notes/enums/enumNotes.js'
import {
  noteLabels,
  priorityLabels,
  rowStylePriorities,
  rowStyleStates
} from '@/components/notes/data/NotesData.js'
import SystemModal from '@/components/system/SystemModal.vue'

const props = defineProps({
  id: { type: String, default: '' },
  modelValue: { type: Boolean, default: false },
  defaultData: { type: Object, default: () => ({}) },
  mode: { type: String, default: 'edit' }
})

const emit = defineEmits([
  'onHideModal',
  'update:modelValue',
  'onObjectCreated',
  'onObjectUpdated',
  'onObjectRemoved'
])

const category = ref({})
const model = ref({})
const loading = reactive({ button: false, card: false })

// Опции для статусов с иконками
const statusOptions = [
  { label: noteLabels[enumStatusNotes.completed], value: enumStatusNotes.completed, icon: Check },
  { label: noteLabels[enumStatusNotes.inPlans], value: enumStatusNotes.inPlans, icon: Timer },
  { label: noteLabels[enumStatusNotes.frozen], value: enumStatusNotes.frozen, icon: IceTea }
]

// Опции для приоритетов
const priorityOptions = [
  { label: priorityLabels[enumPriorities.low], value: enumPriorities.low },
  { label: priorityLabels[enumPriorities.middle], value: enumPriorities.middle },
  { label: priorityLabels[enumPriorities.high], value: enumPriorities.high }
]

const isMode = computed(() => ({
  create: props.mode === 'create',
  edit: props.mode === 'edit'
}))

const cardTitle = computed(() => ({
  create: 'Новая мысль',
  edit: 'Рефлексия над задачей'
}))

const isContentChanged = computed(() => isEqual(category.value, model.value))

// Методы API (create, update, remove, get) остаются такими же как в твоем коде,
// просто убедись, что они вызываются правильно (см. мой предыдущий ответ)
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
  if (isMode.value.create || !category.value._id) return
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

const removeCategory = async () => {
  loading.button = true
  try {
    await CategoryService.categories.remove(category.value._id)
    emit('onObjectRemoved', category.value._id)
  } finally {
    loading.button = false
  }
}

const onHideModal = () => emit('onHideModal')

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (isMode.value.create) {
        category.value = new CategoryModel(props.defaultData)
        model.value = new CategoryModel(props.defaultData)
      } else {
        getCategory()
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
/* Общие стили для сегментов */
:deep(.el-segmented) {
  // Базовый фон сегмента (неактивные кнопки)
  --el-segmented-bg-color: var(--el-fill-color-light);

  // Принудительно белый текст для активного элемента
  .el-segmented__item.is-selected {
    color: #fff !important;
  }

  // Фикс для темной темы: Element Plus в dark mode
  // вешает свои цвета на индикатор (бегунок). Нам нужно его перехватить.
  .el-segmented__item-selected {
    opacity: 1 !important; // Чтобы цвет был насыщенным
  }
}

/* Применяем цвет для Приоритета */
.priority-segmented {
  // Переопределяем переменную фона активного элемента Element Plus
  --el-segmented-item-selected-bg-color: var(--active-priority-color) !important;

  :deep(.el-segmented__item-selected) {
    background-color: var(--active-priority-color) !important;
  }
}

/* Применяем цвет для Состояния */
.state-segmented {
  // Переопределяем переменную фона активного элемента Element Plus
  --el-segmented-item-selected-bg-color: var(--active-state-color) !important;

  :deep(.el-segmented__item-selected) {
    background-color: var(--active-state-color) !important;
  }
}

/* Дополнительная стилизация для формы */
.note-edit-form {
  padding: 10px 20px;
  .form-group {
    margin-bottom: 20px;
    .form-label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--el-text-color-secondary);
      margin-bottom: 8px;
    }
  }
}

.segmented-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: var(--el-text-color-placeholder);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
