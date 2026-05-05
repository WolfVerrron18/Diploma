/** @module HTTP - Обращение по HTTP */
import { http } from '@/utils/http.js'

/** @class ReflectionService - Сервис для работы с размышлениями (заметками) */
class ReflectionService {
  get path() {
    return {
      reflections: 'api/reflections'
    }
  }

  get reflections() {
    return {
      /** @function
       * @name get - Получение конкретной заметки */
      get: (id) => http.get(`${this.path.reflections}/${id}`),

      /** @function
       * @name list - Получение списка всех заметок */
      list: (params) => http.get(this.path.reflections, { params }),

      /** @function
       * @name create - Создание новой мысли */
      create: (payload) => http.post(this.path.reflections, payload),

      /** @function
       * @name update - Обновление существующей заметки */
      update: (id, payload) => http.put(`${this.path.reflections}/${id}`, payload),

      /** @function
       * @name remove - Удаление заметки */
      remove: (id) => http.delete(`${this.path.reflections}/${id}`)
    }
  }
}

export default new ReflectionService()
