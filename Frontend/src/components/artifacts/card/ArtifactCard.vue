<template>
  <SystemModal :model-value="modelValue" :width="550" :height="600" @on-hide-modal="onHideModal">
    <template #title>
      <span>{{ cardTitle }}</span>
      <div class="info-side">
        <span v-if="artifact.createdAt" class="timestamp">
          <el-icon><Calendar /></el-icon>
          {{ formatFullDate(artifact.createdAt) }}
        </span>
      </div>
    </template>

    <template #content>
      <div v-loading="loading" class="minimal-body">
        <div class="top-nav">
          <!-- Режим создания: Показываем селект -->
          <el-select
            v-if="mode === 'create'"
            v-model="artifact.reflectionId"
            placeholder="Выберите источник..."
            variant="none"
            class="source-selector"
            @change="handleSourceChange"
          >
            <el-option
              v-for="item in reflections"
              :key="item._id"
              :label="item.title || 'Без названия'"
              :value="item._id"
            >
              <div class="option-content">
                <span class="option-title">{{ item.title || 'Без названия' }}</span>
              </div>
            </el-option>
          </el-select>

          <!-- Режим редактирования: Показываем красивый тег -->
          <div v-else class="static-source-display">
            <span class="source-label">Размышление:</span>
            <el-tag
              size="large"
              effect="dark"
              :style="{
                '--el-tag-bg-color': 'var(--el-color-primary)',
                '--el-tag-border-color': 'var(--el-color-primary)',
                'background-color': 'var(--el-color-primary)',
                'border-color': 'var(--el-color-primary)'
              }"
            >
              {{ currentReflectionTitle }}
            </el-tag>
          </div>
        </div>

        <div class="editor-section">
          <div class="editor-section__header">
            <el-input v-model="artifact.title" class="title-field" placeholder="Название" />
            <el-rate
              v-model="artifact.importance"
              :max="3"
              :style="{ '--el-rate-fill-color': 'var(--el-color-primary)' }"
            />
          </div>

          <el-input
            v-model="artifact.content"
            type="textarea"
            :autosize="{ minRows: 10 }"
            placeholder="О чем вы думаете?"
            class="minimal-editor"
            input-style="box-shadow: none; padding-left: 0; border: none;"
            resize="none"
          />
        </div>

        <div class="tags-row-fixed">
          <el-select
            v-model="artifact.tags"
            multiple
            filterable
            value-key="_id"
            placeholder="Выберите теги"
            style="width: 100%"
            class="library-style-select"
          >
            <template #tag>
              <el-tag
                v-for="value in artifact.tags"
                :key="value._id"
                effect="dark"
                :color="getTagDisplayData(value)?.color"
                :style="{
                  '--el-tag-bg-color': getTagDisplayData(value)?.color,
                  '--el-tag-border-color': getTagDisplayData(value)?.color,
                  'background-color': getTagDisplayData(value).color,
                  'border-color': getTagDisplayData(value).color
                }"
              >
                {{ value.label }}
              </el-tag>
            </template>

            <el-option-group v-for="cat in categories" :key="cat._id" :label="cat.name">
              <el-option
                v-for="tag in cat.tagsWithColor"
                :key="tag._id"
                :label="tag.label"
                :value="tag"
              >
                <el-tag
                  :color="tag.color"
                  effect="dark"
                  :style="{
                    '--el-tag-bg-color': tag.color,
                    '--el-tag-border-color': tag.color,
                    'background-color': tag.color,
                    'border-color': tag.color
                  }"
                >
                  {{ tag.label }}
                </el-tag>
              </el-option>
            </el-option-group>
          </el-select>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="minimal-footer">
        <div class="footer-left">
          <el-button
            v-if="mode === 'edit'"
            type="danger"
            plain
            :icon="Delete"
            @click="handleDelete"
          >
            Удалить
          </el-button>
        </div>
        <div class="footer-actions">
          <el-button
            type="primary"
            class="save-action-btn"
            :loading="submitting"
            @click="handleSave"
          >
            {{ mode === 'edit' ? 'Сохранить' : 'Зафиксировать' }}
          </el-button>
        </div>
      </div>
    </template>
  </SystemModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Calendar, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import SystemModal from '@/components/system/SystemModal.vue'
import ReflectionService from '@/components/reflections/service/ReflectionService.js'
import ArtifactService from '@/components/artifacts/service/ArtifactService.js'
import TagService from '@/components/tags/service/TagService.js'

const props = defineProps({
  modelValue: Boolean,
  defaultData: Object,
  mode: { type: String, default: 'create' }
})

const emit = defineEmits(['onHideModal', 'onSave', 'onDelete'])

const reflections = ref([])
const categories = ref([])
const loading = ref(false)
const submitting = ref(false)

const artifact = ref({
  reflectionId: '',
  title: '',
  content: '',
  importance: 1,
  tags: [],
  createdAt: new Date()
})

const tags = ref([])

const getTagsMap = computed(() => {
  return tags.value.reduce((map, tag) => {
    map[tag._id] = tag
    return map
  }, {})
})

// Находим заголовок текущего размышления для режима редактирования
const currentReflectionTitle = computed(() => {
  const target =
    typeof artifact.value.reflectionId === 'object'
      ? artifact.value.reflectionId
      : reflections.value.find((r) => r._id === artifact.value.reflectionId)

  return target?.title
})

const getTagDisplayData = (tag) => {
  return getTagsMap.value[tag._id] || tag
}

const fetchTagsData = async () => {
  try {
    const response = await TagService.categories.list()
    categories.value = response.data
    tags.value = categories.value.flatMap((category) => category.tagsWithColor)
  } catch (e) {
    console.error('Ошибка загрузки тегов:', e)
  }
}

const fetchAvailableReflections = async () => {
  loading.value = true
  try {
    const response = await ReflectionService.reflections.list()
    reflections.value = response.data.filter((_reflection) => !_reflection.isDisabled)
  } catch (e) {
    ElMessage.error('Не удалось загрузить источники')
  } finally {
    loading.value = false
  }
}

const handleSourceChange = (val) => {
  if (props.mode === 'create') {
    const source = reflections.value.find((r) => r._id === val)
    if (source) {
      artifact.value.title = source.title || ''
      artifact.value.content = source.content || ''
      artifact.value.importance = source.importance || 1

      if (source.tags && Array.isArray(source.tags)) {
        artifact.value.tags = source.tags
          .map((tagOrId) => {
            const tagId = typeof tagOrId === 'object' ? tagOrId._id : tagOrId
            return getTagsMap.value[tagId] || tagOrId
          })
          .filter(Boolean)
      }
    }
  }
}

const fetchArtifactData = async (id) => {
  loading.value = true
  try {
    const response = await ArtifactService.artifacts.get(id)
    artifact.value = response.data
  } catch (e) {
    ElMessage.error('Ошибка загрузки данных артефакта')
    onHideModal()
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  if (!artifact.value.reflectionId) return ElMessage.warning('Выберите источник')
  if (!artifact.value.title) return ElMessage.warning('Укажите название')

  submitting.value = true
  try {
    const rId =
      typeof artifact.value.reflectionId === 'object'
        ? artifact.value.reflectionId._id
        : artifact.value.reflectionId

    const payload = {
      ...artifact.value,
      reflectionId: rId,
      tags: artifact.value.tags.map((t) => t._id)
    }

    let response
    if (props.mode === 'edit') {
      response = await ArtifactService.artifacts.update(artifact.value._id, payload)
    } else {
      response = await ArtifactService.artifacts.create(payload)
    }

    emit('onSave', response.data)
    onHideModal()
  } catch (e) {
    ElMessage.error('Ошибка сохранения')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('Удалить этот артефакт?', 'Удаление', {
      confirmButtonText: 'Удалить',
      cancelButtonText: 'Отмена',
      type: 'warning'
    })
    loading.value = true
    await ArtifactService.artifacts.remove(artifact.value._id)
    emit('onDelete', artifact.value._id)
    onHideModal()
  } catch (e) {
    if (e !== 'cancel') console.error(e)
  } finally {
    loading.value = false
  }
}

const onHideModal = () => emit('onHideModal')

const formatFullDate = (date) =>
  new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      await Promise.all([fetchTagsData(), fetchAvailableReflections()])

      if (props.mode === 'edit' && props.defaultData?._id) {
        await fetchArtifactData(props.defaultData._id)
      } else {
        artifact.value = {
          reflectionId: '',
          title: '',
          content: '',
          importance: 1,
          tags: [],
          createdAt: new Date()
        }
      }
    }
  },
  { immediate: true }
)

const cardTitle = computed(() => (props.mode === 'create' ? 'Новая запись' : 'Редактирование'))
</script>

<style scoped lang="scss">
.minimal-body {
  padding: 10px 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.top-nav {
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 20px;
  padding-bottom: 12px;

  .source-selector {
    width: 100%;
    :deep(.el-select__wrapper) {
      padding: 0;
      box-shadow: none !important;
      background: transparent;
    }
  }
}

.static-source-display {
  display: flex;
  align-items: center;
  gap: 12px;

  .source-label {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
}

.selected-source-label {
  font-weight: 500;
  color: var(--el-color-primary);
  font-size: 0.95rem;
}

.option-content {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
  padding: 5px 0;

  .option-title {
    font-weight: 600;
    font-size: 14px;
  }
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .title-field {
    flex: 1;
    :deep(.el-input__wrapper) {
      box-shadow: none !important;
      padding: 0;
      background: transparent;
    }
    :deep(.el-input__inner) {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
}

.tags-row-fixed {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px dashed var(--el-border-color-lighter);
}

.minimal-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  align-items: center;
  width: 100%;
  padding: 12px 24px;
}

.save-action-btn {
  transition: all 0.3s;

  &:hover {
    transform: translateY(-1px);
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
