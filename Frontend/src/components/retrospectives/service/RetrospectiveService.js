/** @module HTTP - Обращение по HTTP */
import { http } from '@/utils/http.js'

/** @class RetrospectiveService - Сервис для работы с тематическими ретроспективами */
class RetrospectiveService {
  get path() {
    return {
      retrospectives: 'api/retrospectives'
    }
  }

  /**
   * @section Основные действия с ретроспективами
   */
  get retrospectives() {
    return {
      /**
       * @function
       * @name list - Получение списка всех сохраненных ретроспектив
       */
      list: (params) => http.get(this.path.retrospectives, { params }),

      /**
       * @function
       * @name get - Детальная информация о конкретной ретроспективе (с артефактами)
       */
      get: (id) => http.get(`${this.path.retrospectives}/${id}`),

      /**
       * @function
       * @name prepare - Получение черновика (подборка артефактов по категории)
       * Вызывается перед созданием, чтобы пользователь выбрал артефакты из списка
       */
      prepare: (categoryId) => http.get(`${this.path.retrospectives}/prepare/${categoryId}`),

      /**
       * @function
       * @name create - Сохранение новой ретроспективы
       */
      create: (payload) => http.post(this.path.retrospectives, payload),

      /**
       * @function
       * @name remove - Удаление ретроспективы
       */
      remove: (id) => http.delete(`${this.path.retrospectives}/${id}`)
    }
  }

  /**
   * @section Аналитика и выборки
   */
  get analytics() {
    return {
      /** Получение статистики по категориям (средний score, количество) */
      stats: () => http.get(`${this.path.retrospectives}/stats`),

      /** Быстрый фильтр ретроспектив по конкретной категории */
      byCategory: (categoryId) => http.get(this.path.retrospectives, { params: { categoryId } })
    }
  }
}

export default new RetrospectiveService()
