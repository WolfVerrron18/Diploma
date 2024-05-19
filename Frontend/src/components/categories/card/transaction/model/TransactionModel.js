/** @module lodash - Библиотека вспомогательных функций */
import { forEach } from 'lodash'

/** @class TransactionModel - Базовый класс транзакции */
export class TransactionModel {
  constructor(category) {
    this.name = '' // Наименование
    this.type = null // Тип
    this.categoryId = '' // Идентификатор категории
    this.bankAccountId = '' // Идентификатор счёта
    this.data = null // Дата

    this.fillFields(category)
  }

  /** @method
   * @name fillFields - Заполнение полей по умолчанию */
  fillFields(category) {
    console.log(category)
    forEach(category, (value, key) => (this[key] = value))
  }
}
