/** @module HTTP - Обращение по HTTP */
import { http } from '@/utils/http.js'

/** @class ArtifactService - Сервис для работы с кристаллизованными артефактами */
class ArtifactService {
  get path() {
    return {
      artifacts: 'api/artifacts'
    }
  }

  /**
   * @section Работа с артефактами
   */
  get artifacts() {
    return {
      /** * @function
       * @name get - Получение конкретного артефакта по ID
       */
      get: (id) => http.get(`${this.path.artifacts}/${id}`),

      /** * @function
       * @name list - Получение списка всех артефактов
       */
      list: (params) => http.get(this.path.artifacts, { params }),

      /** * @function
       * @name create - Кристаллизация артефакта из размышления
       */
      create: (payload) => http.post(this.path.artifacts, payload),

      /** * @function
       * @name update - Обновление данных артефакта
       */
      update: (id, payload) => http.put(`${this.path.artifacts}/${id}`, payload),

      /** * @function
       * @name remove - Удаление артефакта (источник разблокируется на бэке)
       */
      remove: (id) => http.delete(`${this.path.artifacts}/${id}`)
    }
  }

  /**
   * @section Дополнительные методы (если потребуются для фильтров)
   */
  get filters() {
    return {
      /** Получение артефактов по конкретному тегу */
      byTag: (tagId) => http.get(`${this.path.artifacts}`, { params: { tagId } })
    }
  }
}

export default new ArtifactService()
