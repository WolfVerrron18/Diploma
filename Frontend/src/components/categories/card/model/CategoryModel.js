/** @module lodash - Библиотека вспомогательных функций */
import { forEach } from 'lodash'

/** @module enumCategories - Перечисление списков данных для работы с категорией */
import { enumTypeCategories } from '@/components/categories/enums/enumCategories.js'

/** @class CategoryModel - Базовый класс модели категории */
export class CategoryModel {
  constructor(category) {
    this.name = '' // Наименование
    this.description = '' // Описание
    this.type = enumTypeCategories.income // Тип
    this.color = '#877EEA' // Цвет

    this.fillFields(category)
  }

  /** @method
   * @name fillFields - Заполнение полей по умолчанию */
  fillFields(category) {
    forEach(category, (value, key) => (this[key] = value))
  }
}
