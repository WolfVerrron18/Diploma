import { http } from '@/utils/http.js'

class UserService {
  get path() {
    return {
      user: 'api/users'
    }
  }

  get user() {
    return {
      getCurrentUser: () => http.get(`${this.path.user}/account/my`),

      /**
       * Универсальное обновление
       * Если payload — FormData, заголовки подхватятся автоматически
       */
      update: (id, payload) => http.patch(`${this.path.user}/${id}`, payload),

      /**
       * Специальный метод для аватара, чтобы бить точно в цель
       */
      updateAvatar: (id, formData) => {
        return http.patch(`${this.path.user}/${id}/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }
    }
  }
}

export default new UserService()
