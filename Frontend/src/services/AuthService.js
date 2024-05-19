import { http } from '@/utils/http.js'

class AuthService {
  get auth() {
    return {
      /** @function
       * @name login - Аутентификация пользователя */
      login: (payload) => http.post('login', payload),

      /** @function
       * @name register - Регистрация пользователя */
      register: (payload) => http.post('registration', payload),

      /** @function
       * @name logout - Выход из системы */
      logout: () => http.post('logout')
    }
  }
}

export default new AuthService()
