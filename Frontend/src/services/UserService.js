import { http } from '@/utils/http.js'

class UserService {
  get path() {
    return {
      user: 'api/users'
    }
  }

  get user() {
    return {
      /** @function
       * @name getCurrentUser - Получение текущего пользователя */
      getCurrentUser: () => http.get('api/users/account/my'),

      update: (id, payload) => http.put(`api/users/${id}`, payload)
    }
  }
}

export default new UserService()
