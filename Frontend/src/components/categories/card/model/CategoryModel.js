/** @module lodash - Библиотека вспомогательных функций */
import { forEach } from 'lodash'

/** @module enumCategories - Перечисление списков данных для работы с категорией */
import { enumPriorities, enumStatusNotes } from '@/components/notes/enums/enumNotes.js'

/** @class CategoryModel - Базовый класс модели категории */
export class CategoryModel {
  constructor(category) {
    this.name = '' // Наименование
    this.description = '' // Описание
    this.type = enumStatusNotes.inPlans // Состояние
    this.priority = enumPriorities.low
    this.color = '#877EEA' // Цвет
    this.dateCreation = new Date()

    this.fillFields(category)
  }

  /** @method
   * @name fillFields - Заполнение полей по умолчанию */
  fillFields(category) {
    forEach(category, (value, key) => (this[key] = value))
  }
}
