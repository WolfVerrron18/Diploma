export const reflectionTagLinks = [
  { id: 'Смарт-зеркало для ванной', tags: ['IoT', 'Прототип', 'UI/UX'] },
  { id: 'Геймификация быта', tags: ['Разработка', 'UI/UX', 'Продуктивность'] },
  { id: 'Бот-помощник для растений', tags: ['IoT', 'Разработка'] },
  { id: 'Редизайн лендинга', tags: ['UI/UX', 'Разработка', 'Прототип'] },
  { id: 'Подкаст о факапах', tags: ['Разработка', 'Музыка', 'Психология'] },
  { id: 'Модульная мебель для кота', tags: ['Дом', 'Прототип'] },
  { id: 'Сервис обмена книгами', tags: ['Разработка', 'Минимализм'] },
  { id: 'Автоматизация кухни', tags: ['IoT', 'Дом'] },
  { id: 'Новая механика в UI', tags: ['UI/UX', 'Разработка'] },
  { id: "Приложение 'Что в холодильнике'", tags: ['AI', 'Разработка', 'Рецепты'] },
  { id: 'Купить комплектующие', tags: ['Покупки', 'Разработка'] },
  { id: 'Визит к стоматологу', tags: ['Здоровье', 'Важное'] },
  { id: 'Конференция VueConf', tags: ['Vue', 'Конференция', 'Frontend'] },
  { id: 'Подарки на НГ', tags: ['Покупки', 'Семья', 'Важное'] },
  { id: 'Оплатить хостинг', tags: ['Backend', 'Важное'] },
  { id: 'Тренировка: Плечи', tags: ['Спорт', 'Здоровье'] },
  { id: 'Рецепт пасты с песто', tags: ['Рецепты', 'Осознанность'] },
  { id: 'Список в дорогу', tags: ['Важное', 'Отдых'] },
  { id: 'Подписка на Spotify', tags: ['Музыка', 'Покупки'] },
  { id: 'Забрать посылку', tags: ['Покупки', 'Важное'] },
  { id: 'Продуктивность vs Отдых', tags: ['Продуктивность', 'Психология', 'Осознанность'] },
  { id: 'Минимализм в коде', tags: ['Разработка', 'Минимализм', 'Backend'] },
  { id: 'Страх чистого листа', tags: ['Психология', 'Разработка'] },
  { id: 'Будущее AI', tags: ['AI', 'Разработка', 'Прототип'] },
  { id: 'Ощущение времени', tags: ['Осознанность', 'Психология'] },
  { id: 'Почему Vue лучше React?', tags: ['Vue', 'Frontend', 'Разработка'] },
  { id: 'Осознанность', tags: ['Осознанность', 'Психология', 'Здоровье'] },
  { id: 'Выход из зоны комфорта', tags: ['Rust', 'Разработка', 'Психология'] },
  { id: 'Ценность оффлайна', tags: ['Минимализм', 'Отдых', 'Осознанность'] },
  { id: "Философия 'Small Wins'", tags: ['Продуктивность', 'Психология', 'Важное'] }
]

/**
 * Основная функция генерации связанных данных
 */
export const generateFullSeedData = (reflectionsRaw, categoriesRaw) => {
  const allTagsMap = categoriesRaw.reduce((map, category) => {
    const tagsMap = category.tags.reduce((mapTags, tag) => {
      return {
        ...mapTags,
        [tag.label]: tag._id
      }
    }, {})

    return {
      ...map,
      ...tagsMap
    }
  }, {})

  return reflectionsRaw.map((sample) => {
    // 1. Находим нужные теги по заголовку
    const { tags: selectedTags } = reflectionTagLinks.find((reflectionTagLink) => {
      return reflectionTagLink.id === sample.title
    })

    return {
      reflectionId: sample._id,
      title: sample.title,
      content: sample.content,
      createdAt: new Date(),
      tags: selectedTags.map((tag) => allTagsMap[tag]), // Сохраняем массив ID тегов
      importance: Math.floor(Math.random() * 3) + 1
    }
  })
}
