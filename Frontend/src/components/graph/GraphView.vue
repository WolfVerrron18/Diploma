<template>
  <div class="analytics-page">
    <header class="header">
      <div class="title-section">
        <div class="filter-group">
          <button
            v-for="mode in filterModes"
            :key="mode.value"
            @click="activeFilter = mode.value"
            :class="['filter-btn', { active: activeFilter === mode.value }]"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="label">Выбрано артефактов</span>
        <span class="value">{{ filteredArtifacts.length }}</span>
      </div>
      <div class="stat-card">
        <span class="label">Топ категория</span>
        <span class="value" :style="{ color: topTagInfo.color }">{{ topTagInfo.label }}</span>
      </div>
      <div class="stat-card highlight">
        <span class="label">Высокая важность (3★)</span>
        <span class="value">{{ highImportanceCount }}</span>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-box">
        <h3>Рейтинг в выборке</h3>
        <div class="canvas-container">
          <Doughnut v-if="importanceData" :data="importanceData" :options="donutOptions" />
        </div>
      </div>

      <div class="chart-box wide">
        <h3>Области знаний</h3>
        <div class="canvas-container">
          <Bar v-if="tagsData" :data="tagsData" :options="barOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

// --- Фильтрация ---
const activeFilter = ref('all') // 'all' | 'active' | 'archived'
const filterModes = [
  { label: 'Все', value: 'all' },
  { label: 'Активные', value: 'active' },
  { label: 'Архив', value: 'archived' }
]

const filteredArtifacts = computed(() => {
  if (activeFilter.value === 'active') {
    return artifacts.value.filter((a) => !a.isArchived)
  }
  if (activeFilter.value === 'archived') {
    return artifacts.value.filter((a) => a.isArchived)
  }
  return artifacts.value
})

// --- Статистика на основе отфильтрованных данных ---
const highImportanceCount = computed(() => {
  return filteredArtifacts.value.filter((a) => a.importance === 3).length
})

const processedTags = computed(() => {
  if (!filteredArtifacts.value.length) return []
  const tagMap = {}

  filteredArtifacts.value.forEach((art) => {
    if (art.tagsWithStyles) {
      art.tagsWithStyles.forEach((t) => {
        const label = t.label || 'Тэг'
        if (!tagMap[label]) {
          tagMap[label] = { count: 0, color: t.color || '#909399' }
        }
        tagMap[label].count++
      })
    }
  })

  return Object.entries(tagMap)
    .map(([label, info]) => ({ label, ...info }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12)
})

const topTagInfo = computed(() => {
  return processedTags.value.length > 0 ? processedTags.value[0] : { label: '—', color: '#2d3748' }
})

// --- Данные графиков ---
const importanceData = computed(() => {
  if (!filteredArtifacts.value.length) return null
  const counts = { 1: 0, 2: 0, 3: 0 }
  filteredArtifacts.value.forEach((a) => counts[a.importance]++)

  return {
    labels: ['★', '★★', '★★★'],
    datasets: [
      {
        backgroundColor: ['#E2E8F0', '#63B3ED', '#48BB78'],
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

const donutOptions = { responsive: true, maintainAspectRatio: false }
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: { legend: { display: false } },
  scales: { x: { beginAtZero: true }, y: { grid: { display: false } } }
}

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
  padding: 30px;
  background: #f7fafc;
  min-height: 100vh;
  color: #2d3748;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.title-section h1 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 12px;
}

/* Стили кнопок фильтрации */
.filter-group {
  display: flex;
  background: #edf2f7;
  padding: 4px;
  border-radius: 10px;
  width: fit-content;
}

.filter-btn {
  padding: 6px 16px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #718096;
  border-radius: 8px;
  transition: all 0.2s;
}

.filter-btn.active {
  background: white;
  color: #2d3748;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.stat-card .label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #718096;
  margin-bottom: 8px;
  display: block;
}

.stat-card .value {
  font-size: 1.5rem;
  font-weight: 700;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 25px;
}

.chart-box {
  grid-column: span 4;
  background: white;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.chart-box.wide {
  grid-column: span 8;
}

.canvas-container {
  position: relative;
  height: 350px;
  width: 100%;
}

h3 {
  margin-bottom: 20px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #4a5568;
}

.refresh-btn {
  padding: 10px 20px;
  background: #2d3748;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .chart-box,
  .chart-box.wide {
    grid-column: span 12;
  }
}
</style>
