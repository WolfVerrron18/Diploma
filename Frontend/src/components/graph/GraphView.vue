<template>
  <div class="analytics-page">
    <header class="header">
      <div class="title-section">
        <el-segmented v-model="activeFilter" :options="filterModes" class="filter-segmented" />
      </div>
    </header>

    <div class="stats-grid">
      <el-card shadow="never" class="stat-card">
        <template #header><span class="label">Выбрано</span></template>
        <span class="value">{{ filteredArtifacts.length }}</span>
      </el-card>

      <el-card shadow="never" class="stat-card">
        <template #header><span class="label">Чаще всего использованный тег</span></template>
        <span class="value" :style="{ color: topTagInfo.color }">{{ topTagInfo.label }}</span>
      </el-card>

      <el-card shadow="never" class="stat-card highlight">
        <template #header><span class="label">Важность (3★)</span></template>
        <span class="value">{{ highImportanceCount }}</span>
      </el-card>
    </div>

    <div class="charts-container">
      <div class="chart-box">
        <h3>Рейтинг в выборке</h3>
        <div class="canvas-container">
          <Doughnut v-if="importanceData" :data="importanceData" :options="dynamicChartOptions" />
        </div>
      </div>

      <div class="chart-box wide">
        <h3>Области знаний</h3>
        <div class="canvas-container">
          <Bar v-if="tagsData" :data="tagsData" :options="dynamicBarOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import ArtifactService from '@/components/artifacts/service/ArtifactService.js'
import { Doughnut, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)

const loading = ref(false)
const artifacts = ref([])
const activeFilter = ref('all')

const filterModes = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Архив', value: 'archived' }
]

// --- Логика фильтрации и данных (без изменений) ---
const filteredArtifacts = computed(() => {
  if (activeFilter.value === 'active') return artifacts.value.filter((a) => !a.isArchived)
  if (activeFilter.value === 'archived') return artifacts.value.filter((a) => a.isArchived)
  return artifacts.value
})

const highImportanceCount = computed(
  () => filteredArtifacts.value.filter((a) => a.importance === 3).length
)

const processedTags = computed(() => {
  if (!filteredArtifacts.value.length) return []
  const tagMap = {}
  filteredArtifacts.value.forEach((art) => {
    if (art.tagsWithStyles) {
      art.tagsWithStyles.forEach((t) => {
        const label = t.label || 'Тэг'
        if (!tagMap[label]) tagMap[label] = { count: 0, color: t.color || '#909399' }
        tagMap[label].count++
      })
    }
  })
  return Object.entries(tagMap)
    .map(([label, info]) => ({ label, ...info }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
})

const topTagInfo = computed(() =>
  processedTags.value.length > 0 ? processedTags.value[0] : { label: '—', color: 'inherit' }
)

const importanceData = computed(() => {
  if (!filteredArtifacts.value.length) return null
  const counts = { 1: 0, 2: 0, 3: 0 }
  filteredArtifacts.value.forEach((a) => counts[a.importance]++)
  return {
    labels: ['★', '★★', '★★★'],
    datasets: [
      {
        backgroundColor: ['#94a3b8', '#3b82f6', '#10b981'], // Приглушенные цвета для темной темы
        data: [counts[1], counts[2], counts[3]],
        borderWidth: 0
      }
    ]
  }
})

const tagsData = computed(() => {
  const data = processedTags.value
  if (!data.length) return null
  return {
    labels: data.map((t) => t.label),
    datasets: [
      {
        label: 'Количество',
        data: data.map((t) => t.count),
        backgroundColor: data.map((t) => t.color),
        borderRadius: 4,
        barThickness: 20
      }
    ]
  }
})

// --- Адаптация Chart.js под темную тему Element Plus ---
// Функция для получения текущего цвета текста из CSS-переменных Element Plus
const getThemeColor = (varName) =>
  getComputedStyle(document.documentElement).getPropertyValue(varName).trim()

const dynamicChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: { color: 'rgba(150, 150, 150, 0.9)' } // Нейтральный цвет для подписей
    }
  }
}))

const dynamicBarOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: 'rgba(150, 150, 150, 0.1)' }, // Тусклая сетка
      ticks: { color: 'rgba(150, 150, 150, 0.8)' }
    },
    y: {
      grid: { display: false },
      ticks: { color: 'rgba(150, 150, 150, 0.8)' }
    }
  }
}))

const loadData = async () => {
  loading.value = true
  try {
    const response = await ArtifactService.artifacts.list()
    artifacts.value = response.data || response
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.analytics-page {
  padding: 24px;
  /* Используем фоновые переменные Element Plus */
  background-color: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  min-height: 100vh;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title-section h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--el-text-color-primary);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

/* Стилизация карточек под Element Plus */
.stat-card {
  border: 1px solid var(--el-border-color-lighter);
  background-color: var(--el-bg-color);
}

.label {
  font-size: 0.8rem;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
}

.value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.chart-box {
  grid-column: span 4;
  background-color: var(--el-bg-color);
  padding: 24px;
  border-radius: var(--el-border-radius-base);
  border: 1px solid var(--el-border-color-lighter);
}

.chart-box.wide {
  grid-column: span 8;
}

.canvas-container {
  position: relative;
  height: 340px;
  width: 100%;
}

h3 {
  margin-bottom: 20px;
  font-size: 0.95rem;
  color: var(--el-text-color-regular);
}

@media (max-width: 1200px) {
  .chart-box,
  .chart-box.wide {
    grid-column: span 12;
  }
}
</style>
