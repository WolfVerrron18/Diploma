/** @module HTTP - Обращение по HTTP */
import { http } from '@/utils/http.js'

/** @class CategoryService - Сервис для работы с категориями */
class CategoryService {
  get path() {
    return {
      categories: 'api/categories'
    }
  }

  get categories() {
    return {
      /** @function
       * @name get - Получение категории */
      get: (id) => http.get(`${this.path.categories}/${id}`),

      /** @function
       * @name list - Получение списка категорий */
      list: (params) => http.get(this.path.categories, { params }),

      /** @function
       * @name create - Создание категории */
      create: (payload) => http.post(this.path.categories, payload),

      /** @function
       * @name update - Обновление категории */
      update: (id, payload) => http.put(`${this.path.categories}/${id}`, payload),

      /** @function
       * @name remove - Удаление категории */
      remove: (id) => http.delete(`${this.path.categories}/${id}`)
    }
  }
}

export default new CategoryService()
