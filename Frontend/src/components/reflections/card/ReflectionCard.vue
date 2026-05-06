<template>
  <SystemModal
    :model-value="modelValue"
    :width="520"
    :height="620"
    custom-class="reflection-modal"
    @on-hide-modal="onHideModal"
  >
    <template #title>
      <span>{{ cardTitle }}</span>
      <div v-if="mode === 'edit'" class="info-side">
        <span v-if="note.updatedAt" class="timestamp">
          <el-icon><Calendar /></el-icon>
          {{ formatFullDate(note.updatedAt) }}
        </span>
      </div>
    </template>

    <template #content>
      <div
        v-loading="loading.card"
        class="reflection-body"
        element-loading-background="rgba(0, 0, 0, 0.7)"
      >
        <div class="meta-section">
          <el-segmented v-model="note.type" :options="noteTypes" block class="custom-segmented">
            <template #default="{ item }">
              <div class="segmented-item">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </template>
          </el-segmented>
        </div>

        <div class="editor-section">
          <el-input
            v-model="note.title"
            placeholder="Заголовок (необязательно)"
            maxlength="100"
            class="title-field"
          />

          <el-input
            v-model="note.content"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 12 }"
            placeholder="Начните писать свою мысль..."
            resize="none"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="modal-footer">
        <el-button
          v-if="mode === 'edit'"
          type="danger"
          plain
          :loading="loading.delete"
          @click="handleDelete"
        >
          Удалить
        </el-button>
        <el-button type="primary" class="save-btn" :loading="loading.card" @click="handleSave">
          {{ mode === 'create' ? 'Создать' : 'Сохранить' }}
        </el-button>
      </div>
    </template>
  </SystemModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { Calendar, ChatLineRound, Opportunity, Document } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SystemModal from '@/components/system/SystemModal.vue'
import ReflectionService from '@/components/reflections/service/ReflectionService.js'

const props = defineProps({
  modelValue: Boolean,
  mode: { type: String, default: 'create' },
  defaultData: Object
})

const emit = defineEmits(['onHideModal', 'onObjectCreated', 'onObjectUpdated'])

const note = ref({
  title: '',
  content: '',
  type: 'idea',
  importance: 1
})

const loading = reactive({
  card: false,
  delete: false
})

const noteTypes = [
  { label: 'Идея', value: 'idea', icon: Opportunity },
  { label: 'Заметка', value: 'memo', icon: Document },
  { label: 'Рефлексия', value: 'mind', icon: ChatLineRound }
]

const cardTitle = computed(() => (props.mode === 'create' ? 'Новая запись' : 'Редактирование'))

const handleSave = async () => {
  if (!note.value.content?.trim()) {
    return ElMessage.warning('Поле контента не может быть пустым')
  }

  loading.card = true
  try {
    if (props.mode === 'create') {
      await ReflectionService.reflections.create(note.value)
      ElMessage.success('Записано')
      emit('onObjectCreated')
    } else {
      await ReflectionService.reflections.update(note.value._id, note.value)
      ElMessage.success('Обновлено')
      emit('onObjectUpdated')
    }
    onHideModal()
  } catch (e) {
    ElMessage.error(e.response?.data?.message || 'Ошибка при сохранении')
  } finally {
    loading.card = false
  }
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('Удалить эту запись?', 'Подтверждение', {
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      type: 'warning'
    })

    loading.delete = true
    await ReflectionService.reflections.remove(note.value._id)
    ElMessage.success('Удалено')
    emit('onObjectUpdated')
    onHideModal()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('Ошибка при удалении')
  } finally {
    loading.delete = false
  }
}

const formatFullDate = (date) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const onHideModal = () => emit('onHideModal')

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (props.mode === 'edit' && props.defaultData) {
        note.value = { ...props.defaultData, tags: props.defaultData.tags || [] }
      } else {
        note.value = { title: '', content: '', type: 'idea', importance: 1, tags: [] }
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 30px;
}

.reflection-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 8px;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  .title-field {
    :deep(.el-input__wrapper) {
      box-shadow: none !important;
      padding: 0;
      background: transparent;
    }
    :deep(.el-input__inner) {
      font-size: 1.25rem;
      font-weight: 600;
    }
  }
  :deep(.el-textarea__inner) {
    box-shadow: none !important;
    padding: 0;
    background: transparent;
    font-size: 1rem;
  }
}

.minimal-tag {
  border-radius: 6px;
  border: none;
  font-weight: 600;
  color: #fff !important;
}

.tag-selector {
  width: 110px;
  :deep(.el-select__wrapper) {
    background: transparent;
    border: 1px dashed var(--el-border-color);
    border-radius: 12px;
    box-shadow: none !important;
  }
  :deep(.el-select__selection) {
    display: none;
  } // Скрываем выбранные внутри селектора
}

.tag-option {
  display: flex;
  align-items: center;
  gap: 8px;
  .color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
  .check-icon {
    margin-left: auto;
    color: var(--el-color-primary);
  }
}

.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 0;

  .delete-btn {
    color: #f56c6c;
    &:hover {
      color: #fab6b6;
    }
  }

  .save-btn {
    background-color: #6a89cc;
    border: none;
    border-radius: 8px;
    padding: 10px 25px;
    &:hover {
      background-color: #4a69bd;
    }
  }
}

.info-side .timestamp {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
