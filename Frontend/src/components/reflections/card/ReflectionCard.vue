<template>
  <SystemModal
    :model-value="modelValue"
    :width="520"
    :height="500"
    :title="cardTitle"
    custom-class="reflection-modern-modal"
    @on-hide-modal="onHideModal"
  >
    <template #content>
      <div
        v-loading="loading.card"
        class="reflection-container"
        element-loading-background="rgba(24, 24, 24, 0.8)"
      >
        <!-- Мета-данные (Type) -->
        <div class="reflection-meta">
          <el-segmented
            v-model="note.type"
            :options="noteTypes"
            size="default"
            class="modern-segmented"
          />
        </div>

        <div class="reflection-paper">
          <!-- Title (String, default: '') -->
          <input v-model="note.title" class="title-input" placeholder="Озаглавьте вашу мысль..." />

          <!-- Content (Required, Trim) -->
          <el-input
            v-model="note.content"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 15 }"
            placeholder="Начните писать здесь..."
            resize="none"
            class="content-textarea"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="modern-footer">
        <div class="meta-info">
          <!-- Используем updatedAt из timestamps схемы -->
          <span v-if="note.updatedAt" class="date-chip">
            <el-icon><Calendar /></el-icon>
            {{ formatFullDate(note.updatedAt) }}
          </span>
        </div>
        <div class="footer-actions">
          <el-button
            v-if="mode === 'edit'"
            type="danger"
            link
            :icon="Delete"
            :loading="loading.delete"
            @click="handleDelete"
          >
            Удалить
          </el-button>
          <el-button
            type="primary"
            round
            class="save-btn"
            :loading="loading.card"
            @click="handleSave"
          >
            {{ mode === 'create' ? 'Создать' : 'Сохранить' }}
          </el-button>
        </div>
      </div>
    </template>
  </SystemModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Delete, Calendar } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SystemModal from '@/components/system/SystemModal.vue'
import ReflectionService from '@/components/reflections/service/ReflectionService.js'

const props = defineProps({
  modelValue: Boolean,
  mode: { type: String, default: 'create' },
  defaultData: Object
})

const emit = defineEmits(['onHideModal', 'onObjectCreated', 'onObjectUpdated'])

// Инициализация объекта строго по схеме Mongoose
const note = ref({
  title: '',
  content: '',
  type: 'idea',
  importance: 1
  // userId добавится на бэкенде или при создании, если нужно на фронте
})

const loading = reactive({
  card: false,
  delete: false
})

// Соответствие enum: ['idea', 'memo', 'mind']
const noteTypes = [
  { label: '💡 Идея', value: 'idea' },
  { label: '📝 Заметка', value: 'memo' },
  { label: '🧠 Рефлексия', value: 'mind' }
]

const cardTitle = computed(() => (props.mode === 'create' ? 'Новое размышление' : 'Поток мыслей'))

const formatFullDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleSave = async () => {
  if (!note.value.content?.trim()) {
    return ElMessage.warning('Контент заметки не может быть пустым')
  }

  loading.card = true
  try {
    if (props.mode === 'create') {
      // При создании отправляем объект. Бэкенд сам привяжет userId из сессии
      await ReflectionService.reflections.create(note.value)
      ElMessage.success('Мысль успешно записана')
      emit('onObjectCreated')
    } else {
      // При обновлении используем _id из MongoDB
      await ReflectionService.reflections.update(note.value._id, note.value)
      ElMessage.success('Запись обновлена')
      emit('onObjectUpdated')
    }
    onHideModal()
  } catch (e) {
    ElMessage.error(e.response?.data?.message || 'Ошибка сохранения')
  } finally {
    loading.card = false
  }
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('Удалить эту рефлексию безвозвратно?', 'Внимание', {
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      type: 'warning',
      round: true
    })

    loading.delete = true
    await ReflectionService.reflections.remove(note.value._id)
    ElMessage.success('Запись удалена')
    emit('onObjectUpdated')
    onHideModal()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('Не удалось удалить запись')
  } finally {
    loading.delete = false
  }
}

const onHideModal = () => emit('onHideModal')

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.mode === 'edit' && props.defaultData) {
        // Клонируем данные из БД (включая _id, updatedAt, type и т.д.)
        note.value = { ...props.defaultData }
      } else {
        // Сброс к дефолтным значениям схемы при создании
        note.value = {
          title: '',
          content: '',
          type: 'idea',
          importance: 1
        }
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.reflection-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 10px 15px;
}

/* Панель мета-данных */
.reflection-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px dashed var(--el-border-color-darker);
}

.modern-segmented {
  background: transparent !important;
  --el-segmented-bg-color: rgba(255, 255, 255, 0.05);
  --el-segmented-item-selected-bg-color: var(--el-color-warning);
  --el-segmented-item-selected-color: #000;

  :deep(.el-segmented__item) {
    border-radius: 12px;
    margin: 0 2px;
    font-weight: 600;
  }
}

/* Стилизация бумаги/ввода */
.reflection-paper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .title-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1.6rem;
    font-weight: 700;
    font-family: 'Georgia', serif;
    font-style: italic;
    color: var(--el-color-warning-light-3);

    &::placeholder {
      opacity: 0.3;
    }
  }

  :deep(.content-textarea) {
    .el-textarea__inner {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
      font-size: 1.15rem;
      line-height: 1.7;
      color: var(--el-text-color-regular);
      font-family: 'Georgia', serif;

      &::placeholder {
        font-style: italic;
        opacity: 0.4;
      }
    }
  }
}

/* Футер */
.modern-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-top: 10px;

  .date-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: var(--el-text-color-placeholder);
    background: rgba(255, 255, 255, 0.03);
    padding: 4px 10px;
    border-radius: 8px;
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .save-btn {
    padding: 10px 25px;
    font-weight: 700;
    background: var(--el-color-warning);
    border-color: var(--el-color-warning);
    color: #000;

    &:hover {
      transform: scale(1.02);
      background: var(--el-color-warning-light-3);
    }
  }
}

/* Переопределение стилей модалки для темной темы */
:deep(.reflection-modern-modal) {
  border-radius: 24px;
  background-color: #181818 !important; // Глубокий темный
  border: 1px solid rgba(255, 255, 255, 0.08);

  .el-dialog__header {
    margin-right: 0;
    padding-bottom: 10px;
    .el-dialog__title {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.5;
    }
  }
}
</style>
