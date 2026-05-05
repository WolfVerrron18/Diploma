<template>
  <el-dialog
    :model-value="modelValue"
    :width="600"
    :show-close="false"
    draggable
    class="artifact-modern-modal"
    @close="onHideModal"
  >
    <!-- Шапка: теперь только с названием, без статуса. Служит ручкой для Drag & Drop -->
    <template #header>
      <div class="flex items-center w-full px-2 cursor-move">
        <span class="text-[10px] uppercase tracking-[0.3em] text-amber-500/60 font-bold">
          Crystallized Artifact // v.1.0
        </span>
      </div>
    </template>

    <div class="artifact-content-wrapper px-2 py-4">
      <!-- Блок заголовка и важности -->
      <div class="mb-8 space-y-4">
        <div class="flex justify-between items-start gap-4">
          <input
            v-model="artifact.title"
            class="bg-transparent border-none outline-none text-3xl font-serif italic text-amber-50 w-full placeholder:opacity-20"
            placeholder="Назовите артефакт..."
          />
          <div class="pt-2">
            <el-rate
              v-model="artifact.importance"
              :max="3"
              :colors="['#f59e0b', '#f59e0b', '#f59e0b']"
              void-color="#262626"
            />
          </div>
        </div>
        <div class="h-px bg-gradient-to-r from-amber-500/40 to-transparent w-2/3"></div>
      </div>

      <!-- Основное содержание -->
      <div class="space-y-6">
        <div class="relative">
          <label class="text-[9px] uppercase tracking-widest text-gray-600 absolute -top-3 left-0"
            >Summary</label
          >
          <el-input
            v-model="artifact.content"
            type="textarea"
            :autosize="{ minRows: 6, maxRows: 12 }"
            placeholder="Сформулируйте итоговую мысль..."
            class="modern-artifact-textarea"
          />
        </div>

        <!-- Управление тегами -->
        <div class="bg-[#111] p-4 rounded-xl border border-white/5 space-y-3">
          <label class="text-[9px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <el-icon><PriceTag /></el-icon> Смысловые связи (Tags)
          </label>

          <div class="flex flex-wrap gap-2">
            <el-tag
              v-for="tag in artifact.tags"
              :key="tag"
              closable
              effect="plain"
              class="!bg-transparent !border-gray-700 !text-gray-400"
              @close="handleRemoveTag(tag)"
            >
              {{ tag }}
            </el-tag>

            <el-input
              v-if="inputVisible"
              ref="InputRef"
              v-model="inputValue"
              class="!w-20"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button
              v-else
              class="!bg-transparent !border-dashed !border-gray-700 !text-gray-600"
              size="small"
              @click="showInput"
            >
              + New Tag
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Футер: убрали Created From, оставили только время и кнопки -->
    <template #footer>
      <div class="flex justify-between items-center w-full pt-4 border-t border-white/5">
        <div class="text-[10px] text-gray-600 flex flex-col italic">
          <span>Timestamp: {{ formatTimestamp(artifact.createdAt) }}</span>
        </div>

        <div class="flex gap-4 items-center">
          <el-button link class="!text-gray-500 hover:!text-gray-300" @click="onHideModal">
            Отмена
          </el-button>
          <el-button
            type="primary"
            class="!bg-amber-500 !border-none !text-black !font-bold !rounded-full px-8 hover:!bg-amber-400 transition-transform active:scale-95 shadow-lg shadow-amber-500/10"
            @click="handleSave"
          >
            Сохранить Артефакт
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { PriceTag } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  defaultData: Object
})

const emit = defineEmits(['onHideModal', 'onSave'])

const artifact = ref({
  title: '',
  content: '',
  importance: 1,
  tags: [],
  createdAt: new Date()
})

const inputVisible = ref(false)
const inputValue = ref('')
const InputRef = ref()

const showInput = () => {
  inputVisible.value = true
  nextTick(() => InputRef.value.input.focus())
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    if (!artifact.value.tags.includes(inputValue.value)) {
      artifact.value.tags.push(inputValue.value)
    }
  }
  inputVisible.value = false
  inputValue.value = ''
}

const handleRemoveTag = (tag) => {
  artifact.value.tags = artifact.value.tags.filter((t) => t !== tag)
}

const formatTimestamp = (date) => {
  return new Date(date).toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit'
  })
}

const handleSave = () => {
  if (!artifact.value.title || !artifact.value.content) {
    return ElMessage.warning('Заполните основные поля артефакта')
  }
  emit('onSave', artifact.value)
  onHideModal()
}

const onHideModal = () => emit('onHideModal')

watch(
  () => props.modelValue,
  (val) => {
    if (val && props.defaultData) {
      artifact.value = {
        ...artifact.value,
        title: props.defaultData.title || '',
        content: props.defaultData.content || '',
        tags: props.defaultData.tags || [],
        createdAt: new Date()
      }
    }
  }
)
</script>

<style scoped>
/* Добавляем явный курсор для всей области хедера, чтобы пользователь понимал, что можно тянуть */
:deep(.el-dialog__header) {
  cursor: move;
  margin-right: 0;
  padding-bottom: 10px;
}
</style>
