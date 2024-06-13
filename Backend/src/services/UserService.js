/** @module UserModel - Модель пользователя */
import UserModel from '../models/UserModel.js'

/** @class UserService - Сервис для работы с пользователями */
class UserService {
	get users() {
		return {
			/** @function
			 * @name get - Получение пользователя */
			get: (id) => UserModel.findById(id),

			findByParameter: (params) => UserModel.findOne(params),

			/** @function
			 * @name create - Создание пользователя */
			create: (payload) => UserModel.create(payload),

			/** @function
			 * @name remove - Удаление пользователя */
			remove: (id) => UserModel.findByIdAndDelete(id),
		}
	}
}

export default new UserService()
