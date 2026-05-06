/** @module HTTP - Обращение по HTTP */
import { http } from '@/utils/http.js'

/** @class TagService - Сервис для работы со справочником тегов и категорий */
class TagService {
  get path() {
    return {
      categories: 'api/categories',
      tags: 'api/tags'
    }
  }

  /**
   * @section Работа с категориями
   */
  get categories() {
    return {
      /** @function
       * @name get - Получение категории */
      get: (id) => http.get(`${this.path.categories}/${id}`),

      /** @function
       * @name list - Получение всех категорий со вложенными тегами */
      list: () => http.get(this.path.categories),

      /** @function
       * @name listActive - Получение только активных категорий (с неархивными артефактами) */
      listActive: () => http.get(`${this.path.categories}/active`), // <-- ДОБАВЛЕНО

      /** @function
       * @name create - Создание новой категории */
      create: (payload) => http.post(this.path.categories, payload),

      /** @function
       * @name update - Редактирование категории (имя, цвет, описание) */
      update: (id, payload) => http.patch(`${this.path.categories}/${id}`, payload),

      /** @function
       * @name remove - Удаление категории и всех её тегов (каскадом) */
      remove: (id) => http.delete(`${this.path.categories}/${id}`)
    }
  }

  /**
   * @section Работа с тегами
   */
  get tags() {
    return {
      /** @function
       * @name create - Добавление тега в категорию
       * @param {Object} payload - { categoryId, label } */
      create: (payload) => http.post(this.path.tags, payload),

      /** @function
       * @name update - Переименование тега */
      update: (id, payload) => http.patch(`${this.path.tags}/${id}`, payload),

      /** @function
       * @name remove - Удаление конкретного тега */
      remove: (id) => http.delete(`${this.path.tags}/${id}`)
    }
  }
}

export default new TagService()
