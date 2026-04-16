<template>
  <div class="page-statistics">
    <header class="stats-header">
      <h1 class="page-title">Аналитика</h1>
    </header>

    <div v-if="tasks.list.length > 0" class="statistics-container">
      <el-card class="chart-wrapper animate-fade-in" shadow="never">
        <template #header>
          <div class="card-header">
            <span>Распределение по статусам</span>
          </div>
        </template>
        <div class="chart-container">
          <PolarArea v-if="!tasks.loading" :data="chartData" :options="computedOptions" />
          <div v-else class="loader-overlay" v-loading="tasks.loading"></div>
        </div>
      </el-card>

      <aside class="summary-wrapper animate-slide-in" v-if="!tasks.loading">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>Ключевые показатели</span>
            </div>
          </template>

          <div class="metrics-grid">
            <div class="metric-card">
              <span class="label">Всего задач</span>
              <span class="value">{{ totalTasks }}</span>
            </div>

            <div class="metric-card">
              <span class="label">Выполнено</span>
              <span class="value" :class="{ 'text-success': completionRate > 50 }">
                {{ completionRate }}%
              </span>
            </div>
          </div>

          <div class="analysis-section" v-if="criticalTasks.length">
            <h3 class="subtitle">Критические задачи</h3>
            <div class="task-list">
              <el-alert
                v-for="task in criticalTasks"
                :key="task._id"
                :title="task.name"
                type="error"
                :closable="false"
                class="task-alert"
                show-icon
              />
            </div>
          </div>

          <div class="analysis-section">
            <el-result
              v-if="completionRate === 100"
              icon="success"
              title="Проект завершен"
              sub-title="Все задачи выполнены"
              class="mini-result"
            />
            <div class="recommendation-box">
              <h3 class="subtitle">Интеллектуальный вывод</h3>
              <p class="recommendation-text">
                {{ systemRecommendation }}
              </p>
            </div>
          </div>
        </el-card>
      </aside>
    </div>

    <el-empty
      v-else-if="!tasks.loading"
      description="Нет данных для анализа"
      class="animate-fade-in"
    >
      <el-button type="primary" @click="$router.push({ name: 'notes' })">
        Перейти к задачам
      </el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { PolarArea } from 'vue-chartjs'
import { useDark } from '@vueuse/core' // Важно для динамики цветов графика
import CategoryService from '@/components/categories/service/CategoryService.js'
import { enumStatusNotes, enumPriorities } from '@/components/notes/enums/enumNotes.js'
import { noteLabels, rowStyleStates } from '@/components/notes/data/NotesData.js'
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend)

const isDark = useDark()
const tasks = ref({ list: [], loading: false })

// --- ЛОГИКА АНАЛИТИКИ ---
const totalTasks = computed(() => tasks.value.list.length)
const completionRate = computed(() => {
  if (!totalTasks.value) return 0
  const completed = tasks.value.list.filter((t) => t.type === enumStatusNotes.completed).length
  return Math.round((completed / totalTasks.value) * 100)
})
const criticalTasks = computed(() => {
  return tasks.value.list
    .filter((t) => t.type !== enumStatusNotes.completed && t.priority === enumPriorities.high)
    .slice(0, 3)
})

const systemRecommendation = computed(() => {
  if (totalTasks.value === 0) return 'Список задач пуст. Добавьте новые цели для начала анализа.'
  const frozenCount = tasks.value.list.filter((t) => t.type === enumStatusNotes.frozen).length
  const completedCount = tasks.value.list.filter((t) => t.type === enumStatusNotes.completed).length

  if (completedCount === totalTasks.value)
    return 'Все задачи успешно выполнены! Рекомендуется архивировать список.'
  if (frozenCount > totalTasks.value * 0.3)
    return 'Высокий риск стагнации: более 30% задач заморожено.'
  if (completionRate.value >= 80)
    return 'Проект в завершающей фазе. Рекомендуется финальная проверка.'
  return 'Распределение задач стабильно. Сосредоточьтесь на приоритетах.'
})

const getCategories = async () => {
  tasks.value.loading = true
  try {
    const { data } = await CategoryService.categories.list()
    tasks.value.list = data
  } catch (e) {
    console.error('Ошибка API:', e)
  } finally {
    tasks.value.loading = false
  }
}

// --- ДИНАМИЧЕСКИЙ CONFIG ГРАФИКА ---
// Используем computed, чтобы цвета менялись при смене темы
const computedOptions = computed(() => {
  const textColor = isDark.value ? '#E5EAF3' : '#606266'
  const gridColor = isDark.value ? '#4C4D4F' : '#E4E7ED'

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500, animateRotate: true },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: textColor, usePointStyle: true, padding: 20 }
      }
    },
    scales: {
      r: {
        ticks: { color: textColor, backdropColor: 'transparent', stepSize: 1 },
        grid: { color: gridColor },
        angleLines: { color: gridColor }
      }
    }
  }
})

const chartData = computed(() => {
  const stats = {
    [enumStatusNotes.completed]: 0,
    [enumStatusNotes.inPlans]: 0,
    [enumStatusNotes.frozen]: 0
  }
  tasks.value.list.forEach((task) => {
    if (stats[task.type] !== undefined) stats[task.type]++
  })

  return {
    labels: [
      noteLabels[enumStatusNotes.completed],
      noteLabels[enumStatusNotes.inPlans],
      noteLabels[enumStatusNotes.frozen]
    ],
    datasets: [
      {
        data: [
          stats[enumStatusNotes.completed],
          stats[enumStatusNotes.inPlans],
          stats[enumStatusNotes.frozen]
        ],
        backgroundColor: [
          rowStyleStates[enumStatusNotes.completed],
          rowStyleStates[enumStatusNotes.inPlans],
          rowStyleStates[enumStatusNotes.frozen]
        ],
        hoverOffset: 15,
        borderWidth: isDark.value ? 2 : 1,
        borderColor: isDark.value ? '#141414' : '#fff'
      }
    ]
  }
})

onMounted(() => getCategories())
</script>

<style scoped lang="scss">
.page-statistics {
  padding: 24px;
  background-color: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  min-height: 100%;
  transition: all 0.3s ease;

  .stats-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto 24px;

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }
  }

  .statistics-container {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .card-header {
    font-weight: 600;
    color: var(--el-text-color-secondary);
  }

  .chart-container {
    height: 400px;
    position: relative;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .metric-card {
    background-color: var(--el-fill-color-light);
    padding: 16px;
    border-radius: var(--el-border-radius-base);
    border: 1px solid var(--el-border-color-light);

    .label {
      display: block;
      font-size: 0.8rem;
      color: var(--el-text-color-placeholder);
      margin-bottom: 4px;
    }
    .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--el-text-color-primary);
    }
    .text-success {
      color: var(--el-color-success);
    }
  }

  .analysis-section {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--el-border-color-lighter);

    .subtitle {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--el-text-color-regular);
      margin-bottom: 12px;
    }
  }

  .task-alert {
    margin-bottom: 8px;
    border-radius: 8px;
  }

  .recommendation-box {
    background-color: var(--el-color-primary-light-9);
    padding: 16px;
    border-radius: 8px;
    border-left: 4px solid var(--el-color-primary);

    .recommendation-text {
      font-size: 0.9rem;
      color: var(--el-text-color-primary);
      line-height: 1.5;
      margin: 0;
    }
  }

  .mini-result {
    padding: 10px 0;
    :deep(.el-result__title) {
      font-size: 1rem;
    }
    :deep(.el-result__icon svg) {
      width: 30px;
      height: 30px;
    }
  }

  // Анимации
  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }
  .animate-slide-in {
    animation: slideIn 0.6s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
</style>
