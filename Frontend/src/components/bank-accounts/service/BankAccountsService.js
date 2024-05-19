/** @module HTTP - Обращение по HTTP */
import { http } from '@/utils/http.js'

/** @class BankAccountsService - Сервис для работы с банковскими счетами */
class BankAccountsService {
  get path() {
    return {
      accounts: 'api/bank-accounts'
    }
  }

  get accounts() {
    return {
      /** @function
       * @name get - Получение счёта */
      get: (id) => http.get(`${this.path.accounts}/${id}`),

      /** @function
       * @name list - Получение списка счетов */
      list: (params) => http.get(this.path.accounts, { params }),

      /** @function
       * @name create - Создание счёта */
      create: (payload) => http.post(this.path.accounts, payload),

      /** @function
       * @name update - Обновление счёта */
      update: (id, payload) => http.put(`${this.path.accounts}/${id}`, payload),

      /** @function
       * @name remove - Удаление счёта */
      remove: (id) => http.delete(`${this.path.accounts}/${id}`)
    }
  }
}

export default new BankAccountsService()
