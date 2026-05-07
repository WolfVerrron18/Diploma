import { reflectionTagLinks } from '@/components/artifacts/data/ArtifactsData.js'
import generateCategoryAndTags from '@/components/tags/data/TagsData.js'

const categoryRetroSummary = [
  {
    category: 'Проекты и Идеи',

    retroOutcome:
      'Фокус на стыке IoT и автоматизации быта. Сформирован пул идей для прототипирования механик геймификации и улучшения UI/UX домашних интерфейсов.'
  },
  {
    category: 'Быт и Планы',
    retroOutcome:
      'Приоритет отдан поддержанию работоспособности инструментов и здоровья. Зафиксированы ключевые логистические задачи на ближайший период.'
  },
  {
    category: 'Обучение и IT',
    retroOutcome:
      'Проведен глубокий анализ экосистемы Vue 3. Определены векторы миграции на Composition API и выявлены точки роста в изучении системных языков.'
  },
  {
    category: 'Философия и Мысли',
    retroOutcome:
      'Кристаллизована концепция "чистого кода" через призму минимализма. Пересмотрены подходы к балансу личной эффективности и ментального отдыха.'
  },
  {
    category: 'Личное',
    retroOutcome:
      'Успешно интегрированы новые привычки в сфере досуга и питания. Отмечена важность качественного аудио-контента для поддержания рабочего настроя.'
  }
]

/**
 * Выбирает ID артефактов (заголовки), относящихся к конкретной категории
 * @returns {Array} Массив строк (id/titles артефактов)
 */
export const getArtifactsByCategory = (category, artifacts) => {
  const artifactsMap = artifacts.reduce((map, artifact) => {
    return {
      ...map,
      [artifact._id]: artifact.title
    }
  }, {})

  // 1. Находим нужную категорию
  const targetCategory = generateCategoryAndTags().find((cat) => cat.name === category.name)

  if (!targetCategory) return []

  // 2. Вытягиваем все лейблы тегов этой категории в плоский массив для быстрого поиска
  const categoryTagLabels = targetCategory.tags.map((t) => t.label)

  // 3. Ищем артефакты, у которых есть хотя бы один тег из этой категории
  const matchedArtifacts = reflectionTagLinks
    .filter((link) => {
      // Проверяем пересечение тегов артефакта и тегов категории
      return link.tags.some((tag) => categoryTagLabels.includes(tag))
    })
    .map((link) => link.id) // В вашем случае id — это заголовок (t)

  // 4. "Проверка": выбираем половину (округляем в большую сторону)
  // Для стабильности результата можно брать каждый второй или просто slice
  const halfCount = Math.ceil(matchedArtifacts.length / 2)

  const retroDetails = categoryRetroSummary.find((categoryRetro) => {
    return categoryRetro.category === category.name
  })

  return {
    categoryId: category._id,
    title: retroDetails.category,
    finalInsight: retroDetails.retroOutcome,
    artifacts: matchedArtifacts.slice(0, halfCount).map((artifactName) => {
      return Object.keys(artifactsMap).find((_artifactId) => {
        return artifactsMap[_artifactId] === artifactName
      })
    })
  }
}
