<template>
  <div class="repository-container">
    <!-- Кнопка создания через Teleport в хедер страницы -->
    <Teleport v-if="isMounted" to=".page-header">
      <el-button type="primary" round :icon="Collection" @click="handleCreate">
        Провести ретроспективу
      </el-button>

      <el-button type="info" round @click="asyncCreateRetros"> Тестовые данные </el-button>
    </Teleport>

    <header class="repo-header">
      <div class="brand">
        <span class="brand-subtitle">Систематизация опыта и анализ периодов</span>
      </div>
    </header>

    <div v-loading="loading" class="retrospectives-grid">
      <div
        v-for="item in retrospectives"
        :key="item._id"
        class="retro-item"
        :style="{ '--retro-color': item.categoryId?.color || 'var(--el-color-primary)' }"
        @click="handleEdit(item)"
      >
        <div class="retro-card-inner">
          <div class="card-header">
            <div class="category-info">
              <div class="category-dot" />
              <span class="category-name">{{ item.categoryId?.name || 'Без категории' }}</span>
            </div>
            <!-- Индикатор score (результативность) -->
            <div v-if="item.score" class="score-badge">{{ item.score }}/10</div>
          </div>

          <h3 class="retro-title">{{ item.title }}</h3>

          <p class="retro-insight">
            {{ item.finalInsight }}
          </p>

          <div class="card-footer">
            <div class="stats-row">
              <span class="stat-item">
                <el-icon><Document /></el-icon>
                {{ item.artifacts?.length || 0 }} мыслей
              </span>
              <span class="date-label">
                <el-icon><Calendar /></el-icon>
                {{ formatDate(item.createdAt) }}
              </span>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div v-if="!loading && !retrospectives.length" class="empty-state">
        <el-empty description="Ретроспектив пока нет. Время подвести итоги?" />
      </div>
    </div>

    <!-- Модальное окно ретроспективы -->
    <RetrospectiveCard
      v-model="modalVisible"
      :default-data="selectedRetro"
      :mode="modalMode"
      @on-save="onRetroSaved"
      @on-hide-modal="closeModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowRight, Collection, Calendar, Document } from '@element-plus/icons-vue'
import RetrospectiveCard from '@/components/retrospectives/card/RetrospectiveCard.vue'
import RetrospectiveService from '@/components/retrospectives/service/RetrospectiveService.js'
import ArtifactService from '@/components/artifacts/service/ArtifactService.js'

import { getArtifactsByCategory } from '@/components/retrospectives/data/RetrospectiveData.js'
import TagService from '@/components/tags/service/TagService.js'

const retrospectives = ref([])
const loading = ref(false)
const modalVisible = ref(false)
const modalMode = ref('create')
const selectedRetro = ref(null)
const isMounted = ref(false)

const asyncCreateRetros = async () => {
  loading.value = true

  const { data: categories } = await TagService.categories.list()
  const { data: artifacts } = await ArtifactService.artifacts.list()

  for (const category of categories) {
    const retro = getArtifactsByCategory(category, artifacts)

    await RetrospectiveService.retrospectives.create(retro)
  }

  fetchRetrospectives()
}

const fetchRetrospectives = async () => {
  loading.value = true
  try {
    const response = await RetrospectiveService.retrospectives.list()
    retrospectives.value = response.data
  } catch (e) {
    console.error('Ошибка загрузки ретроспектив:', e)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  modalMode.value = 'create'
  selectedRetro.value = null
  modalVisible.value = true
}

const handleEdit = (item) => {
  modalMode.value = 'edit'
  selectedRetro.value = { _id: item._id }
  modalVisible.value = true
}

const onRetroSaved = () => {
  fetchRetrospectives()
  closeModal()
}

const closeModal = () => {
  modalVisible.value = false
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short'
  })
}

onMounted(() => {
  fetchRetrospectives()
  isMounted.value = true
})
</script>

<style scoped lang="scss">
.repository-container {
  padding: 20px;
  // Высота с учетом шапки приложения
  height: calc(100vh - 135px);
  overflow-y: auto;
  scroll-behavior: smooth;
}

.repo-header {
  margin-bottom: 30px;
  .brand-subtitle {
    font-size: 1rem;
    color: var(--el-text-color-secondary);
  }
}

.retrospectives-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.retro-item {
  background: var(--el-bg-color-overlay);
  border-radius: 16px;
  border: 1px solid var(--el-border-color-light);
  border-left: 4px solid var(--retro-color);
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: var(--el-box-shadow-light);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--el-box-shadow);
    border-color: var(--retro-color);

    .arrow-icon {
      opacity: 1;
      transform: translateX(4px);
    }
  }
}

.retro-card-inner {
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 8px;

  .category-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--retro-color);
  }

  .category-name {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--el-text-color-secondary);
  }
}

.score-badge {
  background: var(--el-fill-color-light);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 800;
  color: var(--retro-color);
  border: 1px solid var(--retro-color);
}

.retro-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin: 0 0 12px 0;
}

.retro-insight {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
  margin: 0 0 20px 0;
  flex-grow: 1;
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px dashed var(--el-border-color-extra-light);
}

.stats-row {
  display: flex;
  gap: 16px;
  align-items: center;
}

.stat-item,
.date-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow-icon {
  opacity: 0;
  font-size: 18px;
  color: var(--retro-color);
  transition: all 0.3s ease;
}

.empty-state {
  grid-column: 1 / -1;
  padding: 80px 0;
}
</style>
