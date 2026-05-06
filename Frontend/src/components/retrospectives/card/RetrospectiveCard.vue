<template>
  <SystemModal :model-value="modelValue" :width="700" :height="600" @on-hide-modal="onHideModal">
    <template #title>
      <span>{{ cardTitle }}</span>
      <div v-if="mode === 'edit'" class="info-side">
        <span class="timestamp">
          <el-icon><Calendar /></el-icon>
          {{ formatFullDate(retro.createdAt) }}
        </span>
      </div>
    </template>

    <template #content>
      <div v-loading="loading" class="retro-body">
        <!-- Шаг 1: Выбор категории (только при создании) -->
        <div v-if="mode === 'create' && !categorySelected" class="category-step">
          <h3 class="step-title">С чего начнем ретроспективу?</h3>

          <div v-if="categories.length > 0" class="category-grid">
            <div
              v-for="cat in categories"
              :key="cat._id"
              class="category-card"
              :style="{ '--cat-color': cat.color || '#409EFF' }"
              @click="selectCategory(cat)"
            >
              <div class="cat-icon" :style="{ backgroundColor: cat.color }">
                {{ cat.name.charAt(0) }}
              </div>
              <span class="cat-name">{{ cat.name }}</span>
            </div>
          </div>

          <!-- Подсказка, если активных категорий нет -->
          <div v-else-if="!loading" class="empty-categories">
            <el-empty description="Нет доступных категорий" :image-size="120">
              <template #extra>
                <p class="empty-hint">
                  Чтобы провести ретроспективу, у вас должны быть созданы <b>артефакты</b>, которые
                  еще не были заархивированы.
                </p>
                <el-button type="primary" plain @click="onHideModal"> Понятно </el-button>
              </template>
            </el-empty>
          </div>
        </div>

        <!-- Шаг 2: Редактирование / Просмотр -->
        <div v-else class="editor-step">
          <div class="retro-header">
            <div class="cat-badge" :style="{ backgroundColor: selectedCategory?.color }">
              {{ selectedCategory?.name }}
            </div>
            <el-input
              v-model="retro.title"
              class="title-field"
              placeholder="Название ретроспективы..."
              :disabled="mode === 'edit'"
            />
          </div>

          <div class="artifacts-selection">
            <span class="section-label">
              Артефакты периода (выбрано: {{ retro.artifacts.length }}):
            </span>
            <div class="artifacts-list custom-scrollbar">
              <div
                v-for="art in availableArtifacts"
                :key="art._id"
                class="artifact-item"
                :class="{
                  'is-selected': retro.artifacts.includes(art._id),
                  'is-disabled': mode === 'edit'
                }"
                @click="mode === 'create' && toggleArtifact(art._id)"
              >
                <el-checkbox
                  v-if="mode === 'create'"
                  :model-value="retro.artifacts.includes(art._id)"
                  :disabled="mode === 'edit'"
                  @click.stop
                />
                <div class="art-info">
                  <span class="art-title">{{ art.title }}</span>
                  <el-rate v-model="art.importance" disabled :max="3" size="small" />
                </div>
              </div>
              <el-empty
                v-if="!availableArtifacts.length"
                description="Нет подходящих артефактов для анализа"
              />
            </div>
          </div>

          <div class="insight-section">
            <span class="section-label">Главный инсайт / Итог периода:</span>
            <el-input
              v-model="retro.finalInsight"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="Каков главный вывод этого периода? Чему мы научились?"
              class="minimal-editor"
              :disabled="mode === 'edit'"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="minimal-footer">
        <el-button v-if="categorySelected && mode === 'create'" @click="categorySelected = false">
          Назад к категориям
        </el-button>

        <el-button
          v-if="mode === 'create' && categories.length"
          type="primary"
          class="save-action-btn"
          :disabled="!isReadyToSave"
          :loading="submitting"
          :style="{
            '--el-button-disabled-bg-color': 'var(--el-color-primary)',
            '--el-button-disabled-border-color': 'var(--el-color-primary)',
            opacity: isReadyToSave ? 1 : 0.5
          }"
          @click="handleSave"
        >
          Завершить и архивировать
        </el-button>
      </div>
    </template>
  </SystemModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SystemModal from '@/components/system/SystemModal.vue'
import TagService from '@/components/tags/service/TagService.js'
import RetrospectiveService from '@/components/retrospectives/service/RetrospectiveService.js'

const props = defineProps({
  modelValue: Boolean,
  defaultData: Object,
  mode: { type: String, default: 'create' }
})

const emit = defineEmits(['onHideModal', 'onSave'])

// Состояние
const loading = ref(false)
const submitting = ref(false)
const categorySelected = ref(false)
const categories = ref([])
const availableArtifacts = ref([])
const selectedCategory = ref(null)

const retro = ref({
  categoryId: '',
  title: '',
  artifacts: [],
  finalInsight: '',
  createdAt: new Date()
})

// Валидация перед сохранением
const isReadyToSave = computed(() => {
  return (
    retro.value.title?.trim() &&
    retro.value.finalInsight?.trim() &&
    retro.value.artifacts?.length > 0 &&
    retro.value.categoryId
  )
})

const cardTitle = computed(() =>
  props.mode === 'create' ? 'Проведение ретроспективы' : 'Детали ретроспективы'
)

/**
 * Загрузка активных категорий
 */
const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await TagService.categories.listActive()
    categories.value = response.data || []
  } catch (e) {
    ElMessage.error('Ошибка при загрузке категорий')
    console.error(e)
  } finally {
    loading.value = false
  }
}

/**
 * Выбор категории и предзагрузка артефактов
 */
const selectCategory = async (cat) => {
  selectedCategory.value = cat
  retro.value.categoryId = cat._id
  loading.value = true
  try {
    const response = await RetrospectiveService.retrospectives.prepare(cat._id)
    availableArtifacts.value = response.data.artifacts || []
    retro.value.title = response.data.suggestedTitle || ''
    retro.value.artifacts = []
    categorySelected.value = true
  } catch (e) {
    ElMessage.error('Не удалось загрузить данные периода')
    console.error(e)
  } finally {
    loading.value = false
  }
}

const toggleArtifact = (id) => {
  const index = retro.value.artifacts.indexOf(id)
  if (index > -1) {
    retro.value.artifacts.splice(index, 1)
  } else {
    retro.value.artifacts.push(id)
  }
}

const handleSave = async () => {
  if (!isReadyToSave.value) return
  submitting.value = true
  try {
    const payload = {
      categoryId: retro.value.categoryId,
      title: retro.value.title,
      artifacts: retro.value.artifacts,
      finalInsight: retro.value.finalInsight
    }
    const response = await RetrospectiveService.retrospectives.create(payload)
    ElMessage.success('Ретроспектива сохранена. Артефакты перенесены в архив.')
    emit('onSave', response.data)
    onHideModal()
  } catch (e) {
    const msg = e.response?.data?.message || 'Ошибка при создании ретроспективы'
    ElMessage.error(msg)
  } finally {
    submitting.value = false
  }
}

const onHideModal = () => {
  categorySelected.value = false
  emit('onHideModal')
}

const formatFullDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : ''

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      if (props.mode === 'create') {
        await fetchCategories()
        retro.value = {
          categoryId: '',
          title: '',
          artifacts: [],
          finalInsight: '',
          createdAt: new Date()
        }
      } else if (props.defaultData?._id) {
        loading.value = true
        try {
          const response = await RetrospectiveService.retrospectives.get(props.defaultData._id)
          retro.value = response.data
          selectedCategory.value = response.data.categoryId
          availableArtifacts.value = response.data.artifacts || []
          categorySelected.value = true
        } catch (e) {
          ElMessage.error('Ошибка загрузки данных')
        } finally {
          loading.value = false
        }
      }
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.retro-body {
  padding: 10px 20px;
  min-height: 400px;
}

.category-step {
  text-align: center;
  padding-top: 20px;
  .step-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 30px;
  }
}

.empty-categories {
  padding: 40px 0;
  .empty-hint {
    color: var(--el-text-color-secondary);
    max-width: 400px;
    margin: 10px auto 20px;
    line-height: 1.5;
    font-size: 14px;
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.category-card {
  padding: 24px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &:hover {
    border-color: var(--cat-color);
    background: var(--el-fill-color-extra-light);
    transform: translateY(-4px);
    box-shadow: var(--el-box-shadow-lighter);
  }

  .cat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    font-weight: 800;
  }

  .cat-name {
    font-weight: 600;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }
}

.editor-step {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.retro-header {
  .cat-badge {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 6px;
    color: white;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .title-field :deep(.el-input__inner) {
    font-size: 20px;
    font-weight: 800;
    padding: 0;
  }
  .title-field :deep(.el-input__wrapper) {
    box-shadow: none !important;
    background: transparent;
    padding: 0;
  }
}

.section-label {
  display: block;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-bottom: 8px;
  font-weight: 600;
}

.artifacts-list {
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid var(--el-border-color-light);
  border-radius: 12px;
  padding: 8px;
  background: var(--el-fill-color-blank);
}

.artifact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  margin-bottom: 4px;
  transition: all 0.2s;

  &:hover:not(.is-disabled) {
    background: var(--el-fill-color-light);
  }

  &.is-selected {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-7);
  }

  &.is-disabled {
    cursor: default;
  }

  .art-info {
    display: flex;
    flex-direction: column;
    .art-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
}

.minimal-footer {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 16px 20px;
}

.footer-right {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.minimal-editor :deep(.el-textarea__inner) {
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.6;
}
.info-side .timestamp {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
</style>
