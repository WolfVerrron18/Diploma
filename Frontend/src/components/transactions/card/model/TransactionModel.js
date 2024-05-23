/** @module lodash - Библиотека вспомогательных функций */
import { forEach } from 'lodash'

/** @class TransactionModel - Базовый класс транзакции */
export class TransactionModel {
  constructor(transaction) {
    this.name = '' // Наименование
    this.sum = 0 // Сумма
    this.type = null // Тип
    this.categoryId = '' // Идентификатор транзакции
    this.bankAccountId = '' // Идентификатор счёта
    this.date = new Date() // Дата

    this.fillFields(transaction)
  }

  /** @method
   * @name fillFields - Заполнение полей по умолчанию */
  fillFields(transaction) {
    forEach(transaction, (value, key) => (this[key] = value))
  }
}
