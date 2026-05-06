<template>
  <div class="repository-container">
    <Teleport v-if="isMounted" to=".page-header">
      <el-button type="primary" round :icon="Tickets" @click="handleCreate">
        Создать артефакт
      </el-button>
    </Teleport>

    <header class="repo-header">
      <div class="brand">
        <span class="brand-subtitle">Ваши артефакты, основанные на размышлениях</span>
      </div>
    </header>

    <div v-loading="loading" class="artifacts-grid">
      <div
        v-for="item in artifacts"
        :key="item._id"
        class="artifact-item"
        @click="handleEdit(item)"
      >
        <div class="artifact-card-inner">
          <div class="card-header">
            <h3 class="artifact-title">{{ item.title || 'Без названия' }}</h3>
            <el-rate :model-value="item.importance" :max="3" disabled class="mini-rate" />
          </div>

          <p class="artifact-preview">
            {{ item.content }}
          </p>

          <div class="card-footer">
            <div v-if="item.tagsWithStyles && item.tagsWithStyles.length" class="tags-container">
              <el-tag
                v-for="tag in item.tagsWithStyles"
                :key="tag._id || tag"
                size="small"
                effect="dark"
                class="compact-tag"
                :style="{
                  '--el-tag-bg-color': typeof tag === 'object' ? tag.color : 'var(--el-color-info)',
                  '--el-tag-border-color':
                    typeof tag === 'object' ? tag.color : 'var(--el-color-info)'
                }"
              >
                {{ typeof tag === 'object' ? tag.label : tag }}
              </el-tag>
            </div>

            <div class="footer-info">
              <span class="date-label">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(item.createdAt) }}
              </span>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && !artifacts.length" class="empty-state">
        <el-empty description="Артефактов пока нет." />
      </div>
    </div>

    <ArtifactCard
      v-model="modalVisible"
      :default-data="selectedArtifact"
      :mode="modalMode"
      @on-save="onArtifactSaved"
      @on-delete="onArtifactDeleted"
      @on-hide-modal="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRight, Tickets, Calendar } from '@element-plus/icons-vue'
import ArtifactCard from '@/components/artifacts/card/ArtifactCard.vue'
import ArtifactService from '@/components/artifacts/service/ArtifactService.js'

const artifacts = ref([])
const loading = ref(false)
const modalVisible = ref(false)
const modalMode = ref('create')
const selectedArtifact = ref(null)
const isMounted = ref(false)

/**
 * Загрузка списка артефактов
 */
const fetchArtifacts = async () => {
  loading.value = true
  try {
    const response = await ArtifactService.artifacts.list()
    artifacts.value = response.data
  } catch (e) {
    console.error('Ошибка загрузки списка:', e)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  modalMode.value = 'create'
  selectedArtifact.value = null
  modalVisible.value = true
}

const handleEdit = (item) => {
  modalMode.value = 'edit'
  // Передаем объект с ID, ArtifactCard сам подтянет свежие данные
  selectedArtifact.value = { _id: item._id }
  modalVisible.value = true
}

const onArtifactSaved = () => {
  fetchArtifacts()
  closeModal()
}

const onArtifactDeleted = () => {
  fetchArtifacts()
  closeModal()
}

const closeModal = () => {
  modalVisible.value = false
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchArtifacts()
  isMounted.value = true
})
</script>

<style scoped lang="scss">
.repository-container {
  padding: 20px;
}

.repo-header {
  margin-bottom: 30px;
  .brand-subtitle {
    font-size: 1rem;
    color: var(--el-text-color-secondary);
  }
}

.artifacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.artifact-item {
  // ЗАМЕНА: Используем системные переменные фона и границ
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  cursor: pointer;
  // Мягкая тень, которая в темной теме будет почти невидима
  box-shadow: var(--el-box-shadow-light);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--el-box-shadow);
    border-color: var(--el-color-primary);

    .arrow-icon {
      opacity: 1;
      transform: translateX(4px);
    }
  }
}

.artifact-card-inner {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.artifact-title {
  font-size: 17px;
  font-weight: 700;
  // ЗАМЕНА: Основной цвет текста из темы
  color: var(--el-text-color-primary);
  margin: 0;
  line-height: 1.3;
}

.artifact-preview {
  font-size: 14px;
  // ЗАМЕНА: Регулярный цвет текста из темы
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin: 0 0 20px 0;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: pre-line;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 16px;
  // ЗАМЕНА: Цвет разделителя
  border-top: 1px solid var(--el-border-color-extra-light);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.compact-tag {
  border: none;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
}

.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow-icon {
  opacity: 0;
  font-size: 16px;
  color: var(--el-color-primary);
  transition: all 0.3s ease;
}

.mini-rate {
  height: auto;
  flex-shrink: 0;
  // Переменная цвета звезд подтянется сама, если в проекте настроена тема
  --el-rate-fill-color: var(--el-color-primary);
}

.empty-state {
  grid-column: 1 / -1;
  padding: 60px 0;
}
</style>
