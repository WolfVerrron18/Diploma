/** @module HTTP - Обращение по HTTP */
import { http } from '@/utils/http.js'

/** @class TransactionService - Сервис для работы с транзакциями */
class TransactionService {
  get path() {
    return {
      transactions: 'api/transactions'
    }
  }

  get transactions() {
    return {
      /** @function
       * @name get - Получение транзакции */
      get: (id) => http.get(`${this.path.transactions}/${id}`),

      /** @function
       * @name list - Получение списка транзакций */
      list: (params) => http.get(this.path.transactions, { params }),

      /** @function
       * @name create - Создание транзакций */
      create: (payload) => http.post(this.path.transactions, payload),

      /** @function
       * @name update - Обновление транзакций */
      update: (id, payload) => http.put(`${this.path.transactions}/${id}`, payload),

      /** @function
       * @name remove - Удаление транзакций */
      remove: (id) => http.delete(`${this.path.transactions}/${id}`)
    }
  }
}

export default new TransactionService()
