import { forEach } from 'lodash'

export class PurposeModel {
  constructor(purpose) {
    this.name = '' // Наименование цели
    this.sum = 0 // Сумма цели
    this.date = '' // Предполагаемая даты завершения цели
    this.description = '' // Описание цели
    this.progress = '' // Текущий прогресс цели
    this.priority = '' // Приоритет цели

    this.fillFields(purpose)
  }

  fillFields(purpose) {
    forEach(purpose, (value, key) => (this[key] = value))
  }
}
