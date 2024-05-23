/** @module lodash - Библиотека вспомогательных функций */
import { forEach } from 'lodash'

/** @class BankAccountModel - Базовый класс модели счёта */
export class BankAccountModel {
  constructor(category) {
    this.name = '' // Наименование
    this.description = '' // Описание
    this.value = 0 // Значение счёта
    this.isHide = false // Скрыт ли счёт

    this.fillFields(category)
  }

  /** @method
   * @name fillFields - Заполнение полей по умолчанию */
  fillFields(category) {
    forEach(category, (value, key) => (this[key] = value))
  }
}
