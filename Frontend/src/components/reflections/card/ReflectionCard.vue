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
          <el-segmented
            v-model="note.type"
            :options="noteTypes"
            block
            class="custom-segmented"
            :disabled="note?.isDisabled"
          >
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
            placeholder="Заголовок *"
            maxlength="100"
            class="title-field"
            :disabled="note?.isDisabled"
          />

          <el-input
            v-model="note.content"
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 12 }"
            placeholder="Начните писать свою мысль..."
            resize="none"
            :disabled="note?.isDisabled"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div v-if="!note?.isDisabled" class="modal-footer">
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

const cardTitle = computed(() => {
  return props.mode === 'create' ? 'Новая запись' : 'Редактирование'
})

const handleSave = async () => {
  // Валидация заголовка
  if (!note.value.title?.trim()) {
    return ElMessage.warning('Пожалуйста, введите заголовок')
  }

  // Валидация контента
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
      &::placeholder {
        color: var(--el-text-color-placeholder);
      }
    }
  }
  :deep(.el-textarea__inner) {
    box-shadow: none !important;
    padding: 0;
    background: transparent;
    font-size: 1rem;
  }
}

.modal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  gap: 8px;

  .save-btn {
    transition: all 0.3s;

    &:hover {
      transform: translateY(-1px);
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
