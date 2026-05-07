/**
 * Генерирует структуру категорий и тегов
 */
const generateCategoryAndTags = () => {
  return [
    {
      name: 'Проекты и Идеи',
      color: '#3b82f6',
      description: 'Технические задумки, стартапы и новые фичи',
      tags: [
        { label: 'AI' },
        { label: 'Разработка' },
        { label: 'UI/UX' },
        { label: 'IoT' },
        { label: 'Прототип' }
      ]
    },
    {
      name: 'Быт и Планы',
      color: '#10b981',
      description: 'Покупки, дом, здоровье и рутинные дела',
      tags: [
        { label: 'Дом' },
        { label: 'Покупки' },
        { label: 'Здоровье' },
        { label: 'Спорт' },
        { label: 'Важное' }
      ]
    },
    {
      name: 'Обучение и IT',
      color: '#8b5cf6',
      description: 'Конференции, языки программирования и софт-скиллы',
      tags: [
        { label: 'Vue' },
        { label: 'Frontend' },
        { label: 'Backend' },
        { label: 'Rust' },
        { label: 'Конференция' }
      ]
    },
    {
      name: 'Философия и Мысли',
      color: '#f59e0b',
      description: 'Размышления о жизни, продуктивности и психологии',
      tags: [
        { label: 'Психология' },
        { label: 'Продуктивность' },
        { label: 'Минимализм' },
        { label: 'Осознанность' }
      ]
    },
    {
      name: 'Личное',
      color: '#ef4444',
      description: 'Семья, отдых и личные предпочтения',
      tags: [{ label: 'Семья' }, { label: 'Музыка' }, { label: 'Отдых' }, { label: 'Рецепты' }]
    }
  ]
}

export default generateCategoryAndTags
